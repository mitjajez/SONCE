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
      'zoom': { type: Number },
      'pan': { type: Object },
      'pan.x': { type: Number },
      'pan.y': { type: Number },
    }).validate(Template.currentData());
  });

});


Template.Ruler.helpers({
  xTicsMajor: () => {
    const instance = Template.instance();
    const ticSepMajor = instance.state.get('ticSepMajor');
    const len = Math.ceil( instance.data.width / ticSepMajor);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        w: 1/instance.data.zoom,
        h: 10/instance.data.zoom,
        x: i*ticSepMajor - instance.data.pan.x,
        y: 0,
      });
    }
    return tics;
  },

  yTicsMajor: () => {
    const instance = Template.instance();
    const ticSepMajor = instance.state.get('ticSepMajor');
    const len = Math.ceil(instance.data.height / ticSepMajor);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        w: 10/instance.data.zoom,
        h: 1/instance.data.zoom,
        x: 0,
        y: i*ticSepMajor - instance.data.pan.y,
      });
    }
    return tics;
  },

  xTicsText: () => {
    const instance = Template.instance();
    const ticSepText = instance.state.get('ticSepText');
    const len = Math.ceil(instance.data.width / ticSepText);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        s: 1/instance.data.zoom,
        r: 0,
        x: i*ticSepText - instance.data.pan.y,
        y: 10,
      });
    }
    return tics;
  },

  yTicsText: () => {
    const instance = Template.instance();
    const ticSepText = instance.state.get('ticSepText');
    const len = Math.ceil(instance.data.height / ticSepText);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        s: 1/instance.data.zoom,
        r: '90',
        x: 10,
        y: i*ticSepText - instance.data.pan.y,
      });
    }
    return tics;
  },

  xTicsMinor: () => {
    const instance = Template.instance();
    const ticSepMinor = instance.state.get('ticSepMinor');
    const len = Math.ceil( instance.data.width / ticSepMinor);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        w: 1/instance.data.zoom,
        h: 5/instance.data.zoom,
        x: i*ticSepMinor - instance.data.pan.x,
        y: 0,
      });
    }
    return tics;
  },

  yTicsMinor: () => {
    const instance = Template.instance();
    const ticSepMinor = instance.state.get('ticSepMinor');
    const len = Math.ceil(instance.data.height / ticSepMinor);
    const tics = new Array();
    for (let i = 0; i < len; i++) {
      tics.push({
        w: 5/instance.data.zoom,
        h: 1/instance.data.zoom,
        x: 0,
        y: i*ticSepMinor - instance.data.pan.y,
      });
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
