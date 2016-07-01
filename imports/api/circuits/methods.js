import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Circuits } from './circuits.js';
import { Elements } from '../elements/elements.js';
import { Wires } from '../wires/wires.js';

import {
  removeElement,
} from '../elements/methods.js';

import {
  removeWire,
} from '../wires/methods.js';

const CIRCUIT_ID_ONLY = new SimpleSchema({
  cid: { type: String },
}).validator();

export const insertCircuit = new ValidatedMethod({
  name: 'circuits.insert',

  validate: new SimpleSchema({
//    "name": { type: String, optional: true },
  }).validator(),

  run() {
    return Circuits.insert({});
  },
});

export const makeCircuitPrivate = new ValidatedMethod({
  name: 'circuits.makePrivate',
  validate: CIRCUIT_ID_ONLY,
  run({ cid }) {
    if (!this.userId) {
      throw new Meteor.Error('circuits.makePrivate.notLoggedIn',
        'Must be logged in to make private circuits.');
    }

    const circuit = Circuits.findOne(cid);

    if (circuit.isLastPublicCircuit()) {
      throw new Meteor.Error('circuits.makePrivate.lastPublicCircuit',
        'Cannot make the last public circuit private.');
    }

    Circuits.update(cid, {
      $set: { owner: this.userId },
    });
  },
});

export const makeCircuitPublic = new ValidatedMethod({
  name: 'circuits.makePublic',
  validate: CIRCUIT_ID_ONLY,
  run({ cid }) {
    if (!this.userId) {
      throw new Meteor.Error('circuits.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    const circuit = Circuits.findOne(cid);
    console.log( "METHOD circuits.makePublic "+ circuit.name );

    if (!circuit.editableBy(this.userId)) {
      throw new Meteor.Error('circuits.makePublic.accessDenied',
        'You don\'t have permission to edit this circuit.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Circuits.update(cid, {
      $unset: { owner: true },
    });
  },
});

export const updateCircuitName = new ValidatedMethod({
  name: 'circuits.updateName',

  validate: new SimpleSchema({
    cid: { type: String },
    newName: { type: String },
  }).validator(),

  run({ cid, newName }) {
    const circuit = Circuits.findOne(cid);
    console.log( "METHOD circuits.updateName "+ circuit.name +" -> "+ newName);

    if (!circuit.editableBy(this.userId)) {
      throw new Meteor.Error('circuits.updateName.accessDenied',
        'You don\'t have permission to edit this circuit.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Circuits.update(cid, {
      $set: { name: newName },
    });
  },
});

export const updateCircuitDescription = new ValidatedMethod({
  name: 'circuits.updateDescription',

  validate: new SimpleSchema({
    cid: { type: String },
    newDescription: { type: String },
  }).validator(),

  run({ cid, newDescription }) {
    const circuit = Circuits.findOne(cid);
    console.log( "METHOD circuits.updateDescription "+ circuit.name +" -> "+ newName);

    if (!circuit.editableBy(this.userId)) {
      throw new Meteor.Error('circuits.updateDescription.accessDenied',
        'You don\'t have permission to edit this circuit.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Circuits.update(cid, {
      $set: { description: newDescription },
    });
  },
});

export const removeCircuit = new ValidatedMethod({
  name: 'circuits.remove',

//  validate: CIRCUIT_ID_ONLY,
  validate: new SimpleSchema({
    cid: { type: String },
  }).validator(),

  run({ cid }) {
    const circuit = Circuits.findOne(cid);
    console.log( "METHOD circuits.remove "+ circuit.name);

    if (!circuit.editableBy(this.userId)) {
      throw new Meteor.Error('circuits.remove.accessDenied',
        'You don\'t have permission to remove this circuit.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    if (circuit.isLastPublicCircuit()) {
      throw new Meteor.Error('circuits.remove.lastPublicCircuit',
        'Cannot delete the last public circuit.');
    }

    Wires.find({'cid': cid}).forEach(function(w) {
      removeWire.call({'wid': w._id});
    });

    Elements.find({'cid': cid}).forEach(function(e) {
      removeElement.call({'eid': e._id});
    });

    Circuits.remove(cid);
  },
});

// Get circuit of all method names on Circuits
const CIRCUITS_METHODS = _.pluck([
  insertCircuit,
  makeCircuitPublic,
  makeCircuitPrivate,
  updateCircuitName,
  removeCircuit,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 circuit operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(CIRCUITS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
