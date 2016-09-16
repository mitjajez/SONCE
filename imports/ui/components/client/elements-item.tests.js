/* eslint-env mocha */

import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';


import { withRenderedTemplate } from '../../test-helpers.js';
import '../elements-item.js';

describe('Elements_item', () => {
  beforeEach(() => {
    Template.registerHelper('_', key => key);
  });

  afterEach(() => {
    Template.deregisterHelper('_');
  });

  it('renders correctly with simple data', () => {
    const element = Factory.build('element', { checked: false });
    const data = {
      element,
      onEditingChange: () => 0,
    };

    withRenderedTemplate('Elements_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), element.text);
      chai.assert.equal($(el).find('.circuit-item.checked').length, 0);
      chai.assert.equal($(el).find('.circuit-item.editing').length, 0);
    });
  });

  it('renders correctly when checked', () => {
    const element = Factory.build('element', { checked: true });
    const data = {
      element,
      onEditingChange: () => 0,
    };

    withRenderedTemplate('Elements_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), element.text);
      chai.assert.equal($(el).find('.circuit-item.checked').length, 1);
    });
  });

  it('renders correctly when editing', () => {
    const element = Factory.build('element');
    const data = {
      element,
      editing: true,
      onEditingChange: () => 0,
    };

    withRenderedTemplate('Elements_item', data, el => {
      chai.assert.equal($(el).find('input[type=text]').val(), element.text);
      chai.assert.equal($(el).find('.circuit-item.editing').length, 1);
    });
  });
});
