import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Elements } from './elements.js';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('elements', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const element = Factory.create('element');
        assert.typeOf(element, 'object');
        assert.typeOf(element.createdAt, 'date');
      });
    });

    it('leaves createdAt on update', () => {
      const createdAt = new Date(new Date() - 1000);
      let element = Factory.create('element', { createdAt });

      const text = 'some new text';
      Elements.update(element, { $set: { text } });

      element = Elements.findOne(element._id);
      assert.equal(element.text, text);
      assert.equal(element.createdAt.getTime(), createdAt.getTime());
    });

    describe('publications', () => {
      let publicCircuit;
      let privateCircuit;
      let userId;

      before(() => {
        userId = Random.id();
        publicCircuit = Factory.create('circuit');
        privateCircuit = Factory.create('circuit', { userId });

        _.times(3, () => {
          Factory.create('element', { cid: publicCircuit._id });
          // TODO get rid of userId, https://github.com/meteor/elements/pull/49
          Factory.create('element', { cid: privateCircuit._id, userId });
        });
      });

      describe('elements.inCircuit', () => {
        it('sends all elements for a public circuit', (done) => {
          const collector = new PublicationCollector();
          collector.collect('elements.inCircuit', publicCircuit._id, (collections) => {
            chai.assert.equal(collections.Elements.length, 3);
            done();
          });
        });

        it('sends all elements for a public circuit when logged in', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('elements.inCircuit', publicCircuit._id, (collections) => {
            chai.assert.equal(collections.Elements.length, 3);
            done();
          });
        });

        it('sends all elements for a private circuit when logged in as owner', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('elements.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.equal(collections.Elements.length, 3);
            done();
          });
        });

        it('sends no elements for a private circuit when not logged in', (done) => {
          const collector = new PublicationCollector();
          collector.collect('elements.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.isUndefined(collections.Elements);
            done();
          });
        });

        it('sends no elements for a private circuit when logged in as another user', (done) => {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect('elements.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.isUndefined(collections.Elements);
            done();
          });
        });
      });
    });
  });
}
