/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { Random } from 'meteor/random';
import { chai } from 'meteor/practicalmeteor:chai';
import { StubCollections } from 'meteor/stub-collections';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sinon } from 'meteor/practicalmeteor:sinon';


import { withRenderedTemplate } from '../../test-helpers.js';
import '../circuits-show-page.js';

import { Elements } from '../../../api/elements/elements.js';
import { Circuits } from '../../../api/circuits/circuits.js';

describe('Circuits_show_page', () => {
  const cid = Random.id();

  beforeEach(() => {
    StubCollections.stub([Elements, Circuits]);
    Template.registerHelper('_', key => key);
    sinon.stub(FlowRouter, 'getParam', () => cid);
    sinon.stub(Meteor, 'subscribe', () => ({
      subscriptionId: 0,
      ready: () => true,
    }));
  });

  afterEach(() => {
    StubCollections.restore();
    Template.deregisterHelper('_');
    FlowRouter.getParam.restore();
    Meteor.subscribe.restore();
  });

  it('renders correctly with simple data', () => {
    Factory.create('circuit', { _id: cid });
    const timestamp = new Date();
    const elements = _.times(3, i => Factory.create('element', {
      cid,
      createdAt: new Date(timestamp - (3 - i)),
    }));

    withRenderedTemplate('Circuits_show_page', {}, el => {
      const elementsText = elements.map(t => t.text).reverse();
      const renderedText = $(el).find('.circuit-items input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, elementsText);
    });
  });
});
