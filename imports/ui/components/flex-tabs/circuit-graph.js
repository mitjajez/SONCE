import { Template } from 'meteor/peerlibrary:blaze-components';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import './circuit-graph.html';

Template.Circuit_graph.onCreated(function circuitsInfoOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
  });

});

Template.Circuit_graph.onRendered(function circuitsInfoOnRendered() {
});

Template.Circuit_graph.helpers({
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

Template.Circuit_graph.events({
});
