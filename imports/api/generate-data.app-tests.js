// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Promise } from 'meteor/promise';
import { _ } from 'meteor/underscore';

const createCircuit = (userId) => {
  const circuit = Factory.create('circuit', { userId });
  _.times(3, () => Factory.create('element', { cid: circuit._id }));
  return circuit;
};

Meteor.methods({
  generateFixtures() {
    resetDatabase();

    // create 3 public circuits
    _.times(3, () => createCircuit());

    // create 3 private circuits
    _.times(3, () => createCircuit(Random.id()));
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = Promise.denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}


export { generateData };
