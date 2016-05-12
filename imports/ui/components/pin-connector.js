import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';

import './pin-connector.html';

Template.Pin_connector.onCreated(function pinConnectorOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    active: false,
  });
});

Template.Pin_connector.onRendered(function pinConnectorOnRendered() {
});

Template.Pin_connector.helpers({
  active() {
    const instance = Template.instance();
    const s = Session.equals('selectedPin', this.element.name +"-"+ this.pin.id);
    return instance.state.get('active') || s;
  }
});

Template.Pin_connector.events({
  'mouseenter .js-pin'(event, instance) {
    instance.state.set('active', true);
  },
  'mouseleave .js-pin'(event, instance) {
    instance.state.set('active', false);
  },
  'click .js-pin'(event, instance) {
    const pin = this.element.name +"-"+ this.pin.id;
    Session.set( "selectedPin", instance.state.equals('selectedPin', pin) ? false : pin);
  },
});
