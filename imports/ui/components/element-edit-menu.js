import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ElementAction } from 'meteor/flextab';
import { Tracker } from 'meteor/tracker';

import './element-edit-menu.html';
import { Elements } from '../../api/elements/elements.js';

import { displayError } from '../lib/errors.js';

import {
  removeElement,
  rotateElement,
} from '../../api/elements/methods.js';


Template.Element_edit_menu.onCreated(function elementEditMenuOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      element: { type: Elements._helpers },
      menuPosition: { type: String, optional: true },
      setSelected: { type: Function },
    }).validate(Template.currentData());
  });

  this.removeElement = (eid) => {
    removeElement.call ({ eid }, displayError);
  };

  this.rotateElement = (eid, phi) => {
    rotateElement.call ({ eid, phi }, displayError);
    Tracker.flush();

  };

});

Template.Element_edit_menu.onRendered(function elementEditMenuOnRendered() {
});

Template.Element_edit_menu.helpers({
  buttons() {
    return ElementAction.getButtons();
  },
  xy(order){
    if (order){
      buttonPos = ["-35,35", "0,50", "35,35", "50,0", "35,-35", "0,-50", "-35,-35", "50,0"];
      return buttonPos[order-1];
    }
    else{
      return "";
    }
  },
});

Template.Element_edit_menu.events({
  'click .element-edit-menu .js-menu-action'(e,t) {
    // packages/rocketchat-ui/views/app/room.coffee
    const el = t.$(e.currentTarget);
    const button = ElementAction.getButtonById ( el.data('id') );
    button.action.call ( this, e, t );
  },
});
