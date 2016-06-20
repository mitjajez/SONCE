import { Template } from 'meteor/peerlibrary:blaze-components';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import './netlist.html';

Template.Netlist.onCreated(function circuitsInfoOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());

    const cid = this.getCircuitId();
    const q = Wires
      .find(
        { 'cid': cid },
        { fields: {'name': 1} }
      )
      .map((w) => {
        return w.name;
      });
      const nets = _.uniq(q)
  });

});

Template.Netlist.onRendered(function circuitsInfoOnRendered() {
});

Template.Netlist.helpers({
  elements() {
    const cid = Template.instance().getCircuitId();
    return Elements.find({ 'cid': cid });
  },
  nets() {
    const cid = Template.instance().getCircuitId();
    const q = Wires
      .find(
        { 'cid': cid },
        { fields: {'name': 1} }
      )
      .map((w) => {
        return w.name;
      });
    return _.uniq(q)
  },
  wires(net) {
    const cid = Template.instance().getCircuitId();
    return Wires.find({ 'cid': cid, 'name': net });
  }
});

Template.Netlist.events({
});
