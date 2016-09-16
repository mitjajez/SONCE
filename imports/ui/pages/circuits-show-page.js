import { Template } from 'meteor/peerlibrary:blaze-components';
import { FlowRouter } from 'meteor/kadira:flow-router';

// API
import { Circuits } from '../../api/circuits/circuits.js';

import { circuitRenderHold } from '../launch-screen.js';
import './circuits-show-page.html';

// Components used inside the template
import './app-not-found.js';
import '../components/circuits-show.js';

Template.Circuits_show_page.onCreated(function circuitsShowPageOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
    this.subscribe('symbols.all');
  });
});

Template.Circuits_show_page.onRendered(function circuitsShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      circuitRenderHold.release();
    }
  });
});

Template.Circuits_show_page.helpers({
  // We use #each on an array of one item so that the "circuit" template is
  // removed and a new copy is added when changing circuits, which is
  // important for animation purposes.
  cidArray() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Circuits.findOne(cid) ? [cid] : [];
  },
  circuitArgs(cid) {
    const instance = Template.instance();
    const circuit = Circuits.findOne(cid, { fields: { _id: true } });
    const elements = circuit && circuit.elements();
    const wires = circuit && circuit.wires();
    return {
      subscriptionsReady: instance.subscriptionsReady(),
      // We pass `circuit` (which contains the full circuit, with all fields,
      // as a function because we want to control reactivity.
      // If we didn't do this the entire circuit would re-render whenever you
      // edit an element. By isolating the reactiviy on the circuit
      // to the area that cares about it, we stop it from happening.
      circuit() {
        return Circuits.findOne(cid);
      },
      elements,
      wires,
    };
  },
});

Template.Circuits_show_page.events({
});
