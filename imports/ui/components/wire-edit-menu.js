import { Template } from 'meteor/peerlibrary:blaze-components';
import { TAPi18n } from 'meteor/tap:i18n';
import {
  WireAction,
  ElementAction,
} from 'meteor/flextab';

import './wire-edit-menu.html';
import { Circuits } from '../../api/circuits/circuits.js';
import { Elements } from '../../api/elements/elements.js';
import { Wires } from '../../api/wires/wires.js';

import { displayError } from '../lib/errors.js';

import {
  removeWire,
//  removeNet,
} from '../../api/wires/methods.js';

Template.Wire_edit_menu.onCreated(function wireEditMenuOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      cid: { type: String },
      active: { type: String },
      selection: { type: String },
      menuPosition: { type: String },
      setSelected: { type: Function },
    }).validate(Template.currentData());
  });

  this.rename = (name) => {
    renameNet.call({ net, newName }, displayError);
  };

  this.remove = (selection) => {
    console.log("active "+ this.data.active);
    console.log( selection );

    if (this.data.active === "wire"){
      console.log("CALL removeWire");
      removeWire.call(
        {	wid: selection },
        displayError
      );
    }
    else if (this.data.active === "net") {
      console.log("CALL removeNet");
      // removeNet.call()

      Wires.find (
        {"cid":this.data.cid, "name":selection},
        {fields: {"_id": 1} }
//      ).map(function (wid) {
//        return wid._id
      ).forEach(function (w) {
        removeWire.call(
          {	wid: w._id },
          displayError
        );
      });

      Elements.find (
        {"cid":this.data.cid, "pins.net":selection},
        {fields: {"_id": 1, "pins":1} }
//      ).map(function (wid) {
//        return wid._id
      ).forEach(function (e) {
        diconnectElementPin.call(
          {eid: e._id, "pin":e.pins.net},
        )
      });

    }
    /*
    if (_.isArray(selection) ) {
      selection.forEach(function(wid) {
        removeWire.call({	wid }, displayError);
      })
    }
    else if (_.isString(selection)) {
      removeWire.call({	selection }, displayError);
    }
    else {
      console.log("What to remove?");
      console.log(selection);
    }
    */
  };

});

Template.Wire_edit_menu.onRendered(function wireEditMenuOnRendered() {
});

Template.Wire_edit_menu.helpers({
  buttons() {
    return WireAction.getButtons();
//    return ElementAction.getButtons();
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
  'click .edit-menu .js-menu-action'(event, instance) {
    console.log( "BUTTON click" );
    // packages/rocketchat-ui/views/app/room.coffee
    const data = instance.$(event.currentTarget).data();
    let button;
    if( this.active === "wire" ) {
      button = WireAction.getButtonById ( data.id );
    }
    else if (this.active === "net") {
      button = WireAction.getButtonById ( data.id );
    }
    else if ( this.active === "element" ) {
      button = ElementAction.getButtonById ( data.id );
    }
    button.action.call ( this, event, instance );
  },
});
