import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';

import './elements-item.html';
import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';

import { displayError } from '../lib/errors.js';

Template.Elements_item.onCreated(function elementsItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      element: { type: Elements._helpers },
      symbol: { type: Symbols._helpers, optional: true }, //TODO: bugfix
      editing: { type: Boolean, optional: true },
      selected: { type: Boolean, optional: true },
      setSelected: { type: Function },
    }).validate(Template.currentData());
  });

});

Template.Elements_item.onRendered(function circuitShowOnRendered() {
});


Template.Elements_item.helpers({
  symbolsSVG() {
    return Session.get("symbolsSVG");
  },
  nameLabel() {
    const element = this.element;
    const symbol = this.symbol;
    const textPadding = 10;
    let x = textPadding;
    if (symbol.width){
      x = textPadding + symbol.width/2;
    }
    return {x: x, y: 0, }
  },
});

Template.Elements_item.events({
});
