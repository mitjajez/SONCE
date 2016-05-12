import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import faker from 'faker';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Circuits } from '../circuits/circuits.js';
import { Symbols } from '../symbols/symbols.js';
import { Components } from '../components/components.js';

class ElementsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.added = ourDoc.added || new Date();

    console.log( "pred" );
    console.log( ourDoc );

    if (!ourDoc.name) {
      let componentKey = Components.findOne({"name": ourDoc.component }, {fields: {key: 1}}).key;
      console.log(componentKey);
      let nextNumber = Elements.find({"component": ourDoc.component }).count();
      nextNumber = nextNumber ? nextNumber + 1 : 1;
      ourDoc.name = `${componentKey}${nextNumber}`;

      while (!!this.findOne({ name: ourDoc.name })) {
        // not going to be too smart here, can go past Z
        nextNumber += 1;
        ourDoc.name = `${componentKey}${nextNumber}`;
      }
    }
    console.log( "potem" );
    console.log( ourDoc );
    const result = super.insert(ourDoc, callback);
    return result;
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
  "added": { type: Date },
  "modified": { type: Date, optional: true },
  "cid": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  "transform": { type: Object },
  "transform.x": { type: Number },
  "transform.y": { type: Number },
  "transform.rot": { type: Number, optional: true  },
  "model": { type: Object, optional: true  },
  "model.name": { type: String },
  "model.options": { type: [String], optional: true  },
  "mentions": { type: [String], optional: true  },
});

Elements.attachSchema(Elements.schema);

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
