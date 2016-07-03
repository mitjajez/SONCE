import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Wires } from './wires.js';
import { Circuits } from '../circuits/circuits.js';
import { Elements } from '../elements/elements.js';

import {
  connectElementPin,
  disconnectElementPin
} from '../elements/methods.js';

export const insertWire = new ValidatedMethod({
  name: 'wires.insert',

  validate: new SimpleSchema({
    'name': { type: String, optional: true },   // generated if empty
    'd': { type: String },                      // path string
    'type': { type: String, optional: true },
    'ends': { type: [Object], maxCount: 2},                 // connected pins
    'ends.$.e': { type: String },               // pin element od node
    'ends.$.p': { type: String },               // pin id      or node id
    'cid': { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ name, d, type, ends, cid}) {
    const circuit = Circuits.findOne(cid);

    if (circuit.isPrivate() && circuit.userId !== this.userId) {
      throw new Meteor.Error('wires.insert.accessDenied',
        "Cannot add wires to a private circuit that is not yours");
    }

    const wire = { name, d, type, ends, cid };
    wire.ends.forEach((end) => {
      if (end.e !== "node") {

        Elements.findOne(
          { 'cid': wire.cid, 'name': end.e },
          { fields: { 'pins.id': 1, 'pins.net': 1 } }
        ).pins.map((p) => {
          if(p.id === end.p){
            if( p.net.indexOf("open") === -1 ) {
              console.log( "NAME = "+ p.net );
              wire.name = p.net;
            }
          }
        });

      }
    });

    const wid = Wires.insert(wire);

    // Update all elements connected to this new wire.
    wire.ends.forEach( function(end) {
      if (end.e === "node") {
        const nodes = Wires.find({ 'cid': wire.cid, 'ends.e': "node" }).count();
        console.log( nodes +" nodes" );
      }
      else {
        connectElementPin.call(
          {cid: wire.cid, name: end.e, pin: end.p, net: wire.name}
        );
      }
    });

    return wid;
  },
});

export const updateWireD = new ValidatedMethod({
  name: 'wires.updateD',
  validate: new SimpleSchema({
    wid: { type: String, regEx: SimpleSchema.RegEx.Id },
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

    Wires.update (
      { 'wid':wid },
      { $set: { 'd': newD } },
    );
  },
});

export const updateWireName = new ValidatedMethod({
  name: 'wires.updateName',
  validate: new SimpleSchema({
    wid: { type: String, regEx: SimpleSchema.RegEx.Id },
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

    Wires.update (
      { 'wid': wid },
      { $set: { 'name': newName } },
    );
  },
});

export const updateNetName = new ValidatedMethod({
  name: 'wires.updateNetName',
  validate: new SimpleSchema({
    net: { type: String },
    newName: { type: String },
    cid: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ wid, newName, cid }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto wires
    // would be correct here?
    const circuit = Circuits.findOne (cid);

    if (!circuit.editableBy(this.userId)) {
      throw new Meteor.Error('wires.updateNetName.accessDenied',
        'Cannot edit wires in a private circuit that is not yours');
    }

    Wires.update (
      { 'cid': cid, 'name': net },
      { $set: { 'name': newName } },
    );
  },
});

export const updateWireEnd = new ValidatedMethod({
  name: 'wires.updateEnd',
  validate: new SimpleSchema({
    'wid': { type: String },
    'newEnd': { type: Object },                 // connected pins
    'newEnd.e': { type: String },               // pin element od node
    'newEnd.p': { type: String },               // pin id      or node id
  }).validator(),
  run({ wid, newEnd }) {

    const wire = Wires.findOne(wid);
    if (wire.ends.indexOf(newEnd) !== -1) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private circuit that is not yours');
    }

    Wires.update(wid, {
      $addToSet: { pins: newEnd }
    });

    connectElementPin.call(
      {cid: wire.cid, name: newEnd.e, pin: newEnd.p, net: wire.name}
    );
  },
});

export const openWireEnd = new ValidatedMethod({
  name: 'wires.openEnd',
  validate: new SimpleSchema({
    'wid': { type: String },
    'end': { type: Object },                 // connected pins
    'end.e': { type: String },               // pin element od node
    'end.p': { type: String },               // pin id      or node id
  }).validator(),
  run({ wid, end }) {
    console.log( "METHOD wires.openEnd "+ wid + " (" +end.e +"-"+ end.p +")" );
    const wire = Wires.findOne(wid);
    if (wire.ends.indexOf(newEnd) !== -1) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!wire.editableBy(this.userId)) {
      throw new Meteor.Error('wires.openEnd.accessDenied',
        'Cannot edit checked status in a private circuit that is not yours');
    }

    Wires.update({'wid': wid, 'ends.e': end.e, 'ends.p': end.p}, {
      $set: { 'ends.$': { 'e':"open", 'p': "open"} }
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

      // Update all elements connected to this new wire.
      wire.ends.forEach( function(end) {
        if (end.e === "node") {
          // disconnectNode
          const nodes = Wires.find({ 'cid': wire.cid, 'ends.e': "node" }).count();
          console.log( nodes +" nodes" );
        }
        else {
          const element = Elements.findOne({ 'cid': wire.cid, 'name': end.e});
          console.log( element );

          if( element ) {
            disconnectElementPin.call(
              {cid: wire.cid, name: end.e, pin: end.p}
            );
          }
          else {
            // if element doesn't exist
            console.log( end.e + " ne obstaja");

          }
        }
      });

      return Wires.remove(wid);
    }
  },
});

// Get list of all method names on Wires
const WIRES_METHODS = _.pluck([
  insertWire,
  updateWireD,
  updateWireName,
  updateNetName,
  updateWireEnd,
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
