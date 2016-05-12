import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Symbols } from './symbols.js';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('symbols', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const symbol = Factory.create('symbol');
        assert.typeOf(symbol, 'object');
        assert.typeOf(symbol.createdAt, 'date');
      });
    });

    it('leaves createdAt on update', () => {
      const createdAt = new Date(new Date() - 1000);
      let symbol = Factory.create('symbol', { createdAt });

      const text = 'some new text';
      Symbols.update(symbol, { $set: { text } });

      symbol = Symbols.findOne(symbol._id);
      assert.equal(symbol.text, text);
      assert.equal(symbol.createdAt.getTime(), createdAt.getTime());
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
          Factory.create('symbol', { cid: publicCircuit._id });
          // TODO get rid of userId, https://github.com/meteor/symbols/pull/49
          Factory.create('symbol', { cid: privateCircuit._id, userId });
        });
      });

      describe('symbols.inCircuit', () => {
        it('sends all symbols for a public circuit', (done) => {
          const collector = new PublicationCollector();
          collector.collect('symbols.inCircuit', publicCircuit._id, (collections) => {
            chai.assert.equal(collections.Symbols.length, 3);
            done();
          });
        });

        it('sends all symbols for a public circuit when logged in', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('symbols.inCircuit', publicCircuit._id, (collections) => {
            chai.assert.equal(collections.Symbols.length, 3);
            done();
          });
        });

        it('sends all symbols for a private circuit when logged in as owner', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('symbols.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.equal(collections.Symbols.length, 3);
            done();
          });
        });

        it('sends no symbols for a private circuit when not logged in', (done) => {
          const collector = new PublicationCollector();
          collector.collect('symbols.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.isUndefined(collections.Symbols);
            done();
          });
        });

        it('sends no symbols for a private circuit when logged in as another user', (done) => {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect('symbols.inCircuit', privateCircuit._id, (collections) => {
            chai.assert.isUndefined(collections.Symbols);
            done();
          });
        });
      });
    });
  });
}
