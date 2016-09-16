/* eslint-env mocha */

import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { withRenderedTemplate } from '../../test-helpers.js';
import '../circuits-show.js';
import { Elements } from '../../../api/elements/elements.js';


describe('Lists_show', () => {
  beforeEach(() => {
    Template.registerHelper('_', (key) => key);
  });

  afterEach(() => {
    Template.deregisterHelper('_');
  });

  it('renders correctly with simple data', () => {
    const circuit = Factory.build('circuit');
    const timestamp = new Date();

    // Create a local collection in order to get a cursor
    // Note that we need to pass the transform in so the documents look right when they come out.
    const elementsCollection = new Mongo.Collection(null, { transform: Elements._transform });
    _.times(3, (i) => {
      const element = Factory.build('element', {
        circuitId: circuit._id,
        createdAt: new Date(timestamp - (3 - i)),
      });
      elementsCollection.insert(element);
    });
    const elementsCursor = elementsCollection.find({}, { sort: { createdAt: -1 } });

    const data = {
      circuit: () => circuit,
      elementsReady: true,
      elements: elementsCursor,
    };

    withRenderedTemplate('Lists_show', data, (el) => {
      const elementsText = elementsCursor.map((t) => t.text);
      const renderedText = $(el).find('.circuit-items input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, elementsText);
    });
  });
});
