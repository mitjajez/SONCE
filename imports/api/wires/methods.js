import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Wires } from './wires.js';
import { Circuits } from '../circuits/circuits.js';

export const insertWire = new ValidatedMethod({
  name: 'wires.insert',

  validate: new SimpleSchema({
    "name": { type: String, optional: true },   // generated if empty
    "d": { type: String },                      // path string
    "type": { type: String, optional: true },
    "pins": { type: [String] },                 // pin names
    "cid": { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ name, d, type, pins, cid}) {
    const circuit = Circuits.findOne(cid);

    if (circuit.isPrivate() && circuit.userId !== this.userId) {
      throw new Meteor.Error('wires.insert.accessDenied',
        'Cannot add wires to a private circuit that is not yours');
    }

    const wire = {
      name,
      d,
      type,
      pins,
      cid,
    };

    return Wires.insert(wire);
  },
});

export const updateWireD = new ValidatedMethod({
  name: 'wires.updateD',
  validate: new SimpleSchema({
    wid: { type: String },
    newD: { type: String },
  }).validator(),
  run({ wid, newD }) {
    const wire = Wires.findOne(wid);
    if (wire.d === newD) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private circuit that is not yours');
    }

    Wires.update(wid, { $set: {
      d: newD,
    } });
  },
});

export const updateWireName = new ValidatedMethod({
  name: 'wires.updateName',
  validate: new SimpleSchema({
    wid: { type: String },
    newName: { type: String },
  }).validator(),
  run({ wid, newName }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto wires
    // would be correct here?
    const wire = Wires.findOne(wid);

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.updateName.accessDenied',
        'Cannot edit wires in a private circuit that is not yours');
    }

    Wires.update(wid, {
      $set: { name: newName },
    });
  },
});

export const updateWirePins = new ValidatedMethod({
  name: 'wires.updatePins',
  validate: new SimpleSchema({
    wid: { type: String },
    newPin: { type: String },
  }).validator(),
  run({ wid, newPin }) {
    const wire = Wires.findOne(wid);
    if (wire.pins.indexOf(newPin) !== -1) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private circuit that is not yours');
    }

    Wires.update(wid, {
      $addToSet: { pins: newPin }
    });
  },
});

export const removeWire = new ValidatedMethod({
  name: 'wires.remove',
  validate: new SimpleSchema({
    wid: { type: String },
  }).validator(),
  run({ wid }) {
    console.log( "METHOD wires.remove "+ wid );
    const wire = Wires.findOne(wid);

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.remove.accessDenied',
        'Cannot remove wires in a private circuit that is not yours');
    }

    if(wire) {
      return Wires.remove(wid);
    }
  },
});

// Get circuit of all method names on Wires
const WIRES_METHODS = _.pluck([
  insertWire,
  updateWireD,
  updateWireName,
  removeWire,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 wires operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(WIRES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
