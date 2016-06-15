import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { moment } from 'meteor/momentjs:moment';

import './element-info.html';
import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';

import { displayError } from '../lib/errors.js';

Template.Element_info.onCreated(function elementInfoOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      element: { type: Elements._helpers },
      cid: { type: String },
      active: { type: String, optional: true },
      selection: { type: String, optional: true },
      menuPosition: { type: String, optional: true },
      setSelected: { type: Function, optional: true},
    }).validate(Template.currentData());
  });
});

Template.Element_info.helpers({
  showDate(date) {
    return moment(date).calendar();
  },
  symbol() {
    return Symbols.findOne({'key': this.element.symbol});
  }

});

Template.Element_info.events({
  "click #foo": function(event, template){

  }
});
