import './ruler.html';

import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Template.Ruler.onCreated( function rulerOnCreated() {

  this.state = new ReactiveDict();
  this.state.setDefault({
    ticSepMinor: 10,
    ticSepMajor: 50,
    ticSepText: 100,
  });

  this.autorun(() => {
    new SimpleSchema({
      'width': { type: Number },
      'height': { type: Number },
      'zoom': { type: Number, decimal: true },
      'pan': { type: Object },
      'pan.x': { type: Number, decimal: true  },
      'pan.y': { type: Number, decimal: true  },
    }).validate(Template.currentData());
  });

});


Template.Ruler.helpers({
  xTicsMajor: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepMajor');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.width / k);
    const off = Math.ceil(instance.data.pan.x / k) * k;
    const tics = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      tics[i] = i*k - off;
    }
    return tics;
  },

  yTicsMajor: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepMajor');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.height / k);
    const off = Math.ceil(instance.data.pan.y / k) * k;
    const tics = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      tics[i] = Math.round(i*k - off);
    }
    return tics;
  },

  xTicsText: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepText');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.width / k);
    const lenoff = Math.ceil(instance.data.pan.x / k);
    const off = lenoff * k;
    const textoff = lenoff * sep;
    const tics = new Array(0);
    for (let i = 0; i < len; i++) {
      tics.push({
        r: '0 5 5',
        t: Math.round(i*k - off),
        text: i*sep - textoff,
      });
    }
    return tics;
  },

  yTicsText: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepText');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.height / k);
    const lenoff = Math.ceil(instance.data.pan.y / k);
    const off = lenoff * k;
    const textoff = lenoff * sep;
    const tics = new Array(0);
    for (let i = 0; i < len; i++) {
      tics.push({
        r: '90 5 5',
        t: Math.round(i*k - off),
        text: i*sep - textoff,
      });
    }
    return tics;
  },

  xTicsMinor: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepMinor');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.width / k);
    const off = Math.ceil(instance.data.pan.x / k) * k;
    const tics = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      tics[i] = Math.round(i*k - off);
    }
    return tics;
  },

  yTicsMinor: () => {
    const instance = Template.instance();
    const sep = instance.state.get('ticSepMinor');
    const k = instance.data.zoom * sep;
    const len = Math.ceil(instance.data.height / k);
    const off = Math.ceil(instance.data.pan.y / k) * k;
    const tics = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      tics[i] = Math.round(i*k - off);
    }
    return tics;
  },

  unZoom: () => {
    const instance = Template.instance();
    const z = instance.data.zoom;
    return 1/z;
  },
});

Template.Ruler.onRendered( function rulerOnRendered() {
});

Template.Ruler.events({
});
