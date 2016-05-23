import { Template } from 'meteor/peerlibrary:blaze-components';
import { Session } from 'meteor/session';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import './circuit-info.html';

Template.Circuit_info.onCreated(function circuitsInfoOnCreated() {
  this.circuit = () => {
    return Circuits.find({ Session.get("openCircuit") });
  };
});

Template.Circuit_info.onRendered(function circuitsInfoOnRendered() {
});

Template.Circuit_info.helpers({
  elements() {
    console.log( this.circuit() );
  },
});

Template.Circuit_info.events({
});
