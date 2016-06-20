import { Template } from 'meteor/peerlibrary:blaze-components';
import { Session } from 'meteor/session';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import {
  updateCircuitName,
  makeCircuitPublic,
  makeCircuitPrivate,
  removeCircuit,
} from '../../../api/circuits/methods.js';

import { displayError } from '../../lib/errors.js';

import './circuit-info.html';

Template.Circuit_info.onCreated(function circuitsInfoOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
  });

  this.deleteCircuit = () => {
    const cid = this.getCircuitId();
    const circuit = Circuits.findOne(cid);
    console.log("DELETE "+ circuit.name);
    const message = `${TAPi18n.__('Are you sure you want to delete the circuit')} ${circuit.name}?`;

    if ( confirm(message) ) { // eslint-disable-line no-alert
      removeCircuit.call( { cid: circuit._id }, displayError);
      FlowRouter.go('App.home');
      return true;
    }

    return false;
  };

});

Template.Circuit_info.onRendered(function circuitsInfoOnRendered() {
});

Template.Circuit_info.helpers({
  circuit() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Circuits.findOne({"_id": cid});

  },
  elements() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Elements.find({ "cid": cid });
  },
  wires() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Wires.find({ "cid": cid });
  }
});

Template.Circuit_info.events({
  'click .js-delete-circuit'(event, instance) {
    event.preventDefault();
    console.log( "CLICK DELETE" );
    instance.deleteCircuit();
  },

});
