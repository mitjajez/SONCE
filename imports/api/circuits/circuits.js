import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

import { Elements } from '../elements/elements.js';
import { Wires } from '../wires/wires.js';

class CircuitsCollection extends Mongo.Collection {
  insert(circuit, callback) {
    const ourCircuit = circuit;
    if (!ourCircuit.name) {
      let nextLetter = 'A';
      ourCircuit.name = `Circuit ${nextLetter}`;

      while (!!this.findOne({ name: ourCircuit.name })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        ourCircuit.name = `Circuit ${nextLetter}`;
      }
    }

    return super.insert(ourCircuit, callback);
  }
  remove(selector, callback) {
    Elements.remove({ cid: selector });
    return super.remove(selector, callback);
  }
}

export const Circuits = new CircuitsCollection('Circuits');

// Deny all client-side updates since we will be using methods to manage this collection
Circuits.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Circuits.schema = new SimpleSchema({
  "name": { type: String },
  "type": { type: String },
  "created": { type: Date },
  "modified": { type: Date },
  "elements": { type: Number, defaultValue: 0 },
  "members": { type: [String] },
  "moderators": { type: [String] },
  "owner": { type: Object },
  userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
});

Circuits.attachSchema(Circuits.schema);

// This represents the keys from Circuits objects that should be published
// to the client. If we add secret properties to Circuit objects, don't circuit
// them here to keep them private to the server.
Circuits.publicFields = {
  name: 1,
//  incompleteCount: 1,
//  userId: 1,
};

Factory.define('circuit', Circuits, {});

Circuits.helpers({
  // A circuit is considered to be private if it has a userId set
  isPrivate() {
    return !!this.userId;
  },
  isLastPublicCircuit() {
    const publicCircuitCount = Circuits.find({ userId: { $exists: false } }).count();
    return !this.isPrivate() && publicCircuitCount === 1;
  },
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }

    return this.userId === userId;
  },
  elements() {
    return Elements.find({ cid: this._id }, { sort: { createdAt: -1 } });
  },
  wires() {
    return Wires.find({ cid: this._id }, { sort: { createdAt: -1 } });
  },
});
