import { Template } from 'meteor/peerlibrary:blaze-components';
import { WireAction } from 'meteor/flextab';
import { TAPi18n } from 'meteor/tap:i18n';

import './wire-edit-menu.html';
import { Wires } from '../../api/wires/wires.js';

import { displayError } from '../lib/errors.js';

import {
  removeWire,
} from '../../api/wires/methods.js';

Template.Wire_edit_menu.onCreated(function wireEditMenuOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      wire: { type: Wires._helpers },
      menuPosition: { type: String },
      setSelected: { type: Function },
    }).validate(Template.currentData());
  });

  this.removeWire = (wid) => {
    removeWire.call({	wid }, displayError);
  };

});

Template.Wire_edit_menu.onRendered(function wireEditMenuOnRendered() {
});

Template.Wire_edit_menu.helpers({
  buttons() {
    return WireAction.getButtons();
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

Template.Wire_edit_menu.events({
  'click .wire-edit-menu .js-menu-action'(e,t) {
    // packages/rocketchat-ui/views/app/room.coffee
    const el = t.$(e.currentTarget);
    const button = WireAction.getButtonById ( el.data('id') );
    button.action.call ( this, e, t );
  },
});
