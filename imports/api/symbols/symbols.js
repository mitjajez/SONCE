import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

class SymbolsCollection extends Mongo.Collection {
  insert(symbol, callback) {
    const ourSymbol = symbol;
    if (!ourSymbol.key) {
      let nextLetter = 'A';
      ourSymbol.key = `Symbol-${nextLetter}`;

      while (!!this.findOne({ key: ourSymbol.key })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        ourSymbol.key = `Symbol-${nextLetter}`;
      }
    }

    return super.insert(ourSymbol, callback);
  }
  update(selector, callback) {
    return super.update(selector, callback);
  }
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Symbols = new SymbolsCollection('Symbols');

// Deny all client-side updates since we will be using methods to manage this collection
Symbols.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Symbols.schema = new SimpleSchema({
  'key': { type: String },
  'title': { type: String },
  'unit': { type: String, optional: true  },
  'svg': { type: String },
  'width': { type: Number, optional: true }, // TODO: remove optional with new symbol library
  'pins': { type: [Object] },
  'pins.$.id': { type: String },
  'pins.$.x': { type: Number },
  'pins.$.y': { type: Number },
  'category': { type: String, optional: true },
  'tags': { type: [String], optional: true },
  'sim': { type: Object, optional: true },
  'sim.$.key': { type: String, optional: true },
  'sim.$.model': { type: String, optional: true },
});

Symbols.attachSchema(Symbols.schema);

Factory.define('symbol', Symbols, {});

Symbols.helpers({
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }

    return this.userId === userId;
  }
});
