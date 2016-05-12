import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

class ComponentsCollection extends Mongo.Collection {
  insert(component, callback) {
    const ourComponent = component;
    if (!ourComponent.key) {
      let nextLetter = 'A';
      ourComponent.key = `Component-${nextLetter}`;

      while (!!this.findOne({ key: ourComponent.key })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        ourComponent.key = `Component-${nextLetter}`;
      }
    }

    return super.insert(ourComponent, callback);
  }
  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

export const Components = new ComponentsCollection('Components');

// Deny all client-side updates since we will be using methods to manage this collection
Components.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Components.schema = new SimpleSchema({
  "key": { type: String },
  "name": { type: String },
  "types": { type: [String], optional: true },
  "category": { type: String, optional: true },
  "tags": { type: [String], optional: true },
  "sim": { type: Object, optional: true },
  "sim.$.key": { type: String },
  "sim.$.model": { type: String },
  "footprints": { type: [String], optional: true }
});

Components.attachSchema(Components.schema);

Factory.define('component', Components, {});

Components.helpers({
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }

    return this.userId === userId;
  }
});
