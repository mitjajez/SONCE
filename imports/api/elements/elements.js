import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Circuits } from '../circuits/circuits.js';
import { Symbols } from '../symbols/symbols.js';
import { Components } from '../components/components.js';

class ElementsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.added = ourDoc.added || new Date();

    if (!ourDoc.name) {
      const componentKey = Components.findOne({"key": ourDoc.component }).key;
      let nextNumber = this.find({
        "cid": ourDoc.cid,
        "component": ourDoc.component,
      }).count();
      nextNumber = nextNumber ? nextNumber + 1 : 1;
      ourDoc.name = `${componentKey}${nextNumber}`;

      while (!!this.findOne({ "name": ourDoc.name, "cid": ourDoc.cid })) {
        // not going to be too smart here, can go past Z
        nextNumber += 1;
        ourDoc.name = `${componentKey}${nextNumber}`;
      }
    }

    return super.insert(ourDoc, callback);
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const elements = this.find(selector).fetch();
    const result = super.remove(selector);
    return result;
  }
}

export const Elements = new ElementsCollection('Elements');

// Deny all client-side updates since we will be using methods to manage this collection
Elements.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Elements.schema = new SimpleSchema({
  "name": { type: String },
  "value": { type: String, optional: true }, //DODAJ REGEX!!! T, G, M, k, m, u, n, p, f
  "component": { type: String },
  "type": { type: String, optional: true },
  "symbol": { type: String },
  "cid": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  "pins": { type: [Object], optional: true  }, //pin names
  "pins.$.id": { type: String },
  "pins.$.x": { type: Number },
  "pins.$.y": { type: Number },
  "pins.$.net": { type: String, optional: true  }, //net names to what pin is connected
  "transform": { type: Object },
  "transform.x": { type: Number },
  "transform.y": { type: Number },
  "transform.rot": { type: Number },
  "model": { type: Object, optional: true  },
  "model.name": { type: String },
  "model.options": { type: [String], optional: true  },
  "mentions": { type: [String], optional: true  },
  "added": { type: Date, denyUpdate: true },
  "modified": { type: Date, optional: true },
});

Elements.attachSchema(Elements.schema);


Elements.publicFields = {
  "name": 1,
  "value": 1,
  "component": 1,
  "type": 1,
  "symbol": 1,
  "cid": 1,
//  "pins": 1,
  "pins.id": 1,
  "pins.x": 1,
  "pins.y": 1,
  "pins.net": 1,
//  "transform": 1,
  "transform.x": 1,
  "transform.y": 1,
  "transform.rot": 1,
  "model": 1,
  "mentions": 1,
  "added": 1,
  "modified": 1,
};

Elements.helpers({
  circuit() {
    return Circuits.findOne(this.cid);
  },
  symbol() {
    return Symbols.findOne(this.symbol);
  },
  editableBy(userId) {
    return this.circuit().editableBy(userId);
  },
});
