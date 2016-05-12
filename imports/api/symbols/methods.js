import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Symbols } from './symbols.js';

const COMPONENT_KEY_ONLY = new SimpleSchema({
  key: { type: String },
}).validator();

export const insertSymbol = new ValidatedMethod({
  name: 'symbols.insert',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Symbols.insert({});
  },
});

export const updateSymbol = new ValidatedMethod({
  name: 'symbols.update',
  validate: new SimpleSchema({
    'symbolId':         { type: String },
    'symbolData':       { type: Object },
    'symbolData.key':   { type: String },
    'symbolData.title': { type: String },
    'symbolData.unit':  { type: String, optional: true },
    'symbolData.svg':   { type: String },
    'symbolData.width': { type: Number },
  }).validator(),
  run({ symbolId, symbolData }) {
    const symbol = Symbols.findOne(symbolId);

    if (!symbol.editableBy(this.userId)) {
      throw new Meteor.Error('symbols.updateName.accessDenied',
        'You don\'t have permission to edit this symbol.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Symbols.update(symbolId, {
      $set: symbolData,
    });
  },
});

export const removeSymbol = new ValidatedMethod({
  name: 'symbols.remove',
  validate: COMPONENT_KEY_ONLY,
  run({ symbolId }) {
    const symbol = Symbols.findOne(symbolId);

    if (!symbol.editableBy(this.userId)) {
      throw new Meteor.Error('symbols.remove.accessDenied',
        'You don\'t have permission to remove this symbol.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Symbols.remove(symbolId);
  },
});

// Get symbol of all method names on Symbols
const COMPONENTS_METHODS = _.pluck([
  insertSymbol,
  updateSymbol,
  removeSymbol,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 symbol operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(COMPONENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
