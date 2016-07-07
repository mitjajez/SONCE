import './circuit-info.html';

import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Circuits } from '../../../api/circuits/circuits.js';
import { displayError } from '../../lib/errors.js';
import {
  updateCircuitName,
  updateCircuitDescription,
  makeCircuitPublic,
  makeCircuitPrivate,
  removeCircuit,
} from '../../../api/circuits/methods.js';

Template.Circuit_info.onCreated(function circuitsInfoOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.state = new ReactiveDict();
  this.state.setDefault({
    'editing': false,
  });

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
  });

  this.toggleCircuitPrivacy = () => {
    const circuit = Circuits.findOne({ '_id': this.getCircuitId() });
    if (circuit.owner) {
      makeCircuitPublic.call({ 'cid': this.getCircuitId() }, displayError);
    } else {
      makeCircuitPrivate.call({ 'cid': this.getCircuitId() }, displayError);
    }
  };

  this.deleteCircuit = () => {
    const cid = this.getCircuitId();
    const circuit = Circuits.findOne(cid);
    console.log('DELETE '+ circuit.name);
    const message = `${TAPi18n.__('Are you sure you want to delete the circuit')} ${circuit.name}?`;

    if ( confirm(message) ) { // eslint-disable-line no-alert
      removeCircuit.call({
        'cid': circuit._id,
      }, displayError);
      FlowRouter.go('App.home');
      return true;
    }

    return false;
  };

  this.saveSetting = () => {
    const cid = this.getCircuitId();
    switch (this.state.get('editing')) {
    case 'circuitName': {
      const name = this.$('input[name=circuitName]').val();
      updateCircuitName.call({
        cid,
        newName: name,
      }, displayError);
      break;
    }
    case 'circuitDescription': {
      const text = this.$('input[name=circuitDescription]').val();
      updateCircuitDescription.call({
        cid,
        text,
      });
      break;
    }
    case 'toggleCircuitPrivacy': {
      const circuit = Circuits.findOne({ '_id': this.getCircuitId() });
      if (circuit.owner) {
        makeCircuitPublic.call({ 'cid': this.getCircuitId() }, displayError);
      } else {
        makeCircuitPrivate.call({ 'cid': this.getCircuitId() }, displayError);
      }
      break;
    }
    case 'deleteCircuit': {
      const cid = this.getCircuitId();
      const circuit = Circuits.findOne(cid);
      console.log('DELETE '+ circuit.name);
      const message = `${TAPi18n.__('Are you sure you want to delete the circuit')} ${circuit.name}?`;

      if ( confirm(message) ) { // eslint-disable-line no-alert
        removeCircuit.call({
          'cid': circuit._id,
        }, displayError);
        FlowRouter.go('App.home');
        return true;
      }

      return false;
    }
    default: {
      console.log('default');
    }
    }
  };

});

Template.Circuit_info.onRendered(function circuitInfoOnRendered() {
});

Template.Circuit_info.helpers({
  editing: (field) => Template.instance().state.equals('editing', field),

  circuit() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Circuits.findOne({ '_id': cid });
  },
});

Template.Circuit_info.events({
  'click [data-edit]' (event, instance) {
    event.preventDefault();
    instance.state.set('editing', $(event.currentTarget).data('edit'));
    setTimeout(function() {
      instance.$('input.js-editing').focus().select();
    }, 100);
  },

  'click .js-save, submit form' (event, instance) {
    event.preventDefault();
    instance.saveSetting();
    instance.state.set('editing', false);
  },

  'click .js-cancel' (event, instance) {
    event.preventDefault();
    instance.state.set('editing', false);
  },

  'click .js-toggle-circuit-privacy'(event, instance) {
    instance.toggleCircuitPrivacy();
  },

  'click .js-delete-circuit' (event, instance) {
    event.preventDefault();
    console.log( 'CLICK DELETE' );
    instance.deleteCircuit();
  },

});
