import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Components } from './components.js';

const COMPONENT_KEY_ONLY = new SimpleSchema({
  key: { type: String },
}).validator();

export const insertComponent = new ValidatedMethod({
  name: 'components.insert',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Components.insert({});
  },
});

export const updateComponentName = new ValidatedMethod({
  name: 'components.updateName',
  validate: new SimpleSchema({
    componentId: { type: String },
    newName: { type: String },
  }).validator(),
  run({ componentId, newName }) {
    const component = Components.findOne(componentId);

    if (!component.editableBy(this.userId)) {
      throw new Meteor.Error('components.updateName.accessDenied',
        'You don\'t have permission to edit this component.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Component.update(componentId, {
      $set: { name: newName },
    });
  },
});

export const removeComponent = new ValidatedMethod({
  name: 'components.remove',
  validate: COMPONENT_KEY_ONLY,
  run({ componentId }) {
    const component = Components.findOne(componentId);

    if (!component.editableBy(this.userId)) {
      throw new Meteor.Error('components.remove.accessDenied',
        'You don\'t have permission to remove this component.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Components.remove(componentId);
  },
});

// Get component of all method names on Components
const COMPONENTS_METHODS = _.pluck([
  insertComponent,
  updateComponentName,
  removeComponent,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 component operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(COMPONENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
