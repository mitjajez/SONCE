import { Template } from 'meteor/peerlibrary:blaze-components';
import { Session } from 'meteor/session';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import './circuit-info.html';

Template.Circuit_info.onCreated(function circuitsInfoOnCreated() {
});

Template.Circuit_info.onRendered(function circuitsInfoOnRendered() {
});

Template.Circuit_info.helpers({
  circuit() {
    const cid = Session.get("openCircuit");
    return Circuits.find({ cid });
  },
  elements() {
    const cid = Session.get("openCircuit");
    return Elements.find({ cid:cid });
  },
  wires() {
    const cid = Session.get("openCircuit");
    return Wires.find({ cid:cid });
  }
});

Template.Circuit_info.events({
});
