import { Template } from 'meteor/peerlibrary:blaze-components';

import { Circuits } from '../../../api/circuits/circuits.js';
import { Elements } from '../../../api/elements/elements.js';
import { Wires } from '../../../api/wires/wires.js';

//const Viz = require("viz.js");
import Viz from 'viz.js';
import Snap from 'snapsvg';

import './circuit-graph.html';

Template.Circuit_graph.onCreated(function circuitsGraphOnCreated() {
  this.getCircuitId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('elements.inCircuit', this.getCircuitId());
    this.subscribe('wires.inCircuit', this.getCircuitId());
  });

  this.dot = () => {
    const cid = this.getCircuitId();
    let dot = "graph circuit_"+ cid +" {";
//    dot += "overlap=false; splines=curved;";
    dot += "node [shape=point]";
    dot += "edge [fontsize=10]";
    Wires.find({ 'cid': cid }).forEach((w) => {
      dot += " "+ w.name + " [label="+w.name+"];";
    });
    Elements.find({ 'cid': cid }).forEach((e) => {
      dot += " "+ e.pins[0].net +"--"+ e.pins[1].net +" [label="+ e.name +"];";
      if( false ) {
        dot += e.pins[0].net +"--"+ e.pins[2].net +" [label="+ e.name +"];";
        dot += e.pins[1].net +"--"+ e.pins[2].net +" [label="+ e.name +"];";
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
    const graph = Viz(instance.dot(), { engine: "twopi" });
    const s = graph.indexOf("<svg");
    return graph.substring(s);
  },
});

Template.Circuit_graph.events({
});
