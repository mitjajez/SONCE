import { Template } from 'meteor/peerlibrary:blaze-components';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import './circuits-list.html';
import { Circuits } from '../../api/circuits/circuits.js';
import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';

import { TAPi18n } from 'meteor/tap:i18n';

import { insertCircuit } from '../../api/circuits/methods.js';

import { displayError } from '../lib/errors.js';


Template.Circuits_list.helpers({
  circuits() {
    return Circuits.find({ $or: [
      { userId: { $exists: false } },
      { userId: Meteor.userId() },
    ] });
  },
  activeCircuitClass(circuit) {
    const active = ActiveRoute.name('Circuits.show')
      && FlowRouter.getParam('_id') === circuit._id;

    return active && 'active';
  },
});

Template.Circuits_list.events({
  'click .js-new-circuit'() {
    const cid = insertCircuit.call((err) => {
      if (err) {
        console.log( err );
        // At this point, we have already redirected to the new circuit page, but
        // for some reason the circuit didn't get created. This should almost never
        // happen, but it's good to handle it anyway.
        FlowRouter.go('App.home');
        alert(TAPi18n.__('Could not create circuit.')); // eslint-disable-line no-alert
      }
    });

    FlowRouter.go('Circuits.show', { _id: cid });
  },
});

Template.Circuits_list.onCreated(function circuitsListOnCreated() {
  this.subscribe('circuits.public');
  this.subscribe('circuits.private');
});

Template.Circuits_list.onRendered(function circuitsListOnRendered() {

});
