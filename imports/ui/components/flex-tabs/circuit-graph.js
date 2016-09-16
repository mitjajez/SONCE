import './circuit-graph.html';
import { Template } from 'meteor/peerlibrary:blaze-components';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

import Viz from 'viz.js';

Template.Circuit_graph.onCreated(function circuitsGraphOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
  });

  this.dot = () => {
    const cid = this.getCircuitId();
    let dot = "graph circuit_"+ cid +" {";
    dot += " node [shape=point];";
    dot += " edge [fontsize=10];";
    const nets = _.uniq(Wires.find({ 'cid': cid }).map((w) => {
      return w.name;
    }));
    nets.forEach((n) => {
      dot += " "+ n + " [label="+n+"];";
    });
    Elements.find({ 'cid': cid }).forEach((e) => {
      if( e.pins[0].net === "open") {
        dot += e.name + "_" + e.pins[0].id + "_";
      }
      dot += e.pins[0].net;
      dot += " -- ";
      if( e.pins[1].net === "open") {
        dot += e.name + "_" + e.pins[1].id + "_";
      }
      dot += e.pins[1].net
      dot += " [label="+ e.name +"];";
      if( false ) {
        dot += e.pins[0].net +" -- "+ e.pins[2].net +" [label="+ e.name +"];";
        dot += e.pins[1].net +" -- "+ e.pins[2].net +" [label="+ e.name +"];";
      }
    });
    dot += " }";
    return dot;
  }

});

Template.Circuit_graph.onRendered(function circuitsGraphOnRendered() {
});

Template.Circuit_graph.helpers({
  elements() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Elements.find({ 'cid': cid });
  },
  wires() {
    const instance = Template.instance();
    const cid = instance.getCircuitId();
    return Wires.find({ 'cid': cid });
  },
  htmlDot() {
    const instance = Template.instance();
    return instance.dot().replace(/[;]/g, ";<br>").replace(/\{/g, "{<br>");
  },
  graph() {
    const instance = Template.instance();
//    const graph = Viz(instance.dot(), { engine: "twopi" });
    const graph = Viz(instance.dot(), { engine: "neato" });
    const s = graph.indexOf("<svg");
    return graph.substring(s);
  },
});

Template.Circuit_graph.events({
});
