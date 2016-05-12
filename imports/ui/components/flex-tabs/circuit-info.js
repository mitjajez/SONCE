import { Template } from 'meteor/peerlibrary:blaze-components';
import { Session } from 'meteor/session';

import { Circuits } from '../../../api/circuits/circuits.js';

import './circuit-info.html';

Template.Circuit_info.onCreated(function circuitsInfoOnCreated() {
  const cid = Session.get("openCircuit");
  console.log( cid );
});

Template.Circuit_info.onRendered(function circuitsInfoOnRendered() {
});

Template.Circuit_info.helpers({
});
