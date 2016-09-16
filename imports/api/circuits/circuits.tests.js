import { Factory } from 'meteor/dburles:factory';
import { Circuits } from './circuits.js';
import { insert, makePublic, makePrivate, updateName, remove } from './methods.js';
import { Elements } from '../elements/elements.js';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('circuits', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const circuit = Factory.create('circuit');
        assert.typeOf(circuit, 'object');
        assert.match(circuit.name, /Circuit /);
      });
    });

    describe('publications', () => {
      const userId = Random.id();

      // TODO -- make a `circuitWithElements` factory
      const createCircuit = (props = {}) => {
        const circuit = Factory.create('circuit', props);
        _.times(3, () => {
          Factory.create('element', { cid: circuit._id });
        });
      };

      before(() => {
        Circuits.remove({});
        _.times(3, () => createCircuit());
        _.times(2, () => createCircuit({ userId }));
        _.times(2, () => createCircuit({ userId: Random.id() }));
      });


      describe('circuits.public', () => {
        it('sends all public circuits', (done) => {
          const collector = new PublicationCollector();
          collector.collect('circuits.public', (collections) => {
            chai.assert.equal(collections.Circuits.length, 3);
            done();
          });
        });
      });

      describe('circuits.private', () => {
        it('sends all owned circuits', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('circuits.private', (collections) => {
            chai.assert.equal(collections.Circuits.length, 2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let cd;
      let elementId;
      let otherCid;
      let userId;

      beforeEach(() => {
        // Clear
        Circuits.remove({});
        Elements.remove({});

        // Create a circuit and a element in that circuit
        cid = Factory.create('circuit')._id;
        elementId = Factory.create('element', { cid })._id;

        // Create throwaway circuit, since the last public circuit can't be made private
        otherCid = Factory.create('circuit')._id;

        // Generate a 'user'
        userId = Random.id();
      });

      describe('makePrivate / makePublic', () => {
        function assertCircuitAndElementArePrivate() {
          assert.equal(Circuits.findOne(cid).userId, userId);
          assert.isTrue(Circuits.findOne(cid).isPrivate());
          assert.isTrue(Elements.findOne(elementId).editableBy(userId));
          assert.isFalse(Elements.findOne(elementId).editableBy(Random.id()));
        }

        it('makes a circuit private and updates the elements', () => {
          // Check initial state is public
          assert.isFalse(Circuits.findOne(cid).isPrivate());

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { cid };

          // Making the circuit private adds userId to the element
          makePrivate._execute(methodInvocation, args);
          assertCircuitAndElementArePrivate();

          // Making the circuit public removes it
          makePublic._execute(methodInvocation, args);
          assert.isUndefined(Elements.findOne(elementId).userId);
          assert.isTrue(Elements.findOne(elementId).editableBy(userId));
        });

        it('only works if you are logged in', () => {
          // Set up method arguments and context
          const methodInvocation = { };
          const args = { cid };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /circuits.makePrivate.notLoggedIn/);

          assert.throws(() => {
            makePublic._execute(methodInvocation, args);
          }, Meteor.Error, /circuits.makePublic.notLoggedIn/);
        });

        it('only works if it\'s not the last public circuit', () => {
          // Remove other circuit, now we're the last public circuit
          Circuits.remove(otherCid);

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { cid };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /circuits.makePrivate.lastPublicCircuit/);
        });

        it('only makes the circuit public if you made it private', () => {
          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { cid };

          makePrivate._execute(methodInvocation, args);

          const otherUserMethodInvocation = { userId: Random.id() };

          // Shouldn't do anything
          assert.throws(() => {
            makePublic._execute(otherUserMethodInvocation, args);
          }, Meteor.Error, /circuits.makePublic.accessDenied/);

          // Make sure things are still private
          assertCircuitAndElementArePrivate();
        });
      });

      describe('updateName', () => {
        it('changes the name, but not if you don\'t have permission', () => {
          updateName._execute({}, {
            cid,
            newName: 'new name',
          });

          assert.equal(Circuits.findOne(cid).name, 'new name');

          // Make the circuit private
          makePrivate._execute({ userId }, { cid });

          // Works if the owner changes the name
          updateName._execute({ userId }, {
            cid,
            newName: 'new name 2',
          });

          assert.equal(Circuits.findOne(cid).name, 'new name 2');

          // Throws if another user, or logged out user, tries to change the name
          assert.throws(() => {
            updateName._execute({ userId: Random.id() }, {
              cid,
              newName: 'new name 3',
            });
          }, Meteor.Error, /circuits.updateName.accessDenied/);

          assert.throws(() => {
            updateName._execute({}, {
              cid,
              newName: 'new name 3',
            });
          }, Meteor.Error, /circuits.updateName.accessDenied/);

          // Confirm name didn't change
          assert.equal(Circuits.findOne(cid).name, 'new name 2');
        });
      });

      describe('remove', () => {
        it('does not delete the last public circuit', () => {
          const methodInvocation = { userId };

          // Works fine
          remove._execute(methodInvocation, { cid: otherCid });

          // Should throw because it is the last public circuit
          assert.throws(() => {
            remove._execute(methodInvocation, { cid });
          }, Meteor.Error, /circuits.remove.lastPublicCircuit/);
        });

        it('does not delete a private circuit you don\'t own', () => {
          // Make the circuit private
          makePrivate._execute({ userId }, { cid });

          // Throws if another user, or logged out user, tries to delete the circuit
          assert.throws(() => {
            remove._execute({ userId: Random.id() }, { cid });
          }, Meteor.Error, /circuits.remove.accessDenied/);

          assert.throws(() => {
            remove._execute({}, { cid });
          }, Meteor.Error, /circuits.remove.accessDenied/);
        });
      });

      describe('rate limiting', () => {
        it('does not allow more than 5 operations rapidly', () => {
          const connection = DDP.connect(Meteor.absoluteUrl());

          _.times(5, () => {
            connection.call(insert.name, {});
          });

          assert.throws(() => {
            connection.call(insert.name, {});
          }, Meteor.Error, /too-many-requests/);

          connection.disconnect();
        });
      });
    });
  });
}
