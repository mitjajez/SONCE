import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';
import { Wires } from '../../api/wires/wires.js';

import './circuits-show.html';

// Component used in the template
import './elements-item.js';
import './wires-item.js';
import './element-info.js';
//import './wire-info.js';
import './element-edit-menu.js';
import './wire-edit-menu.js';
import './operations.js';

import {
  updateCircuitName,
  makeCircuitPublic,
  makeCircuitPrivate,
  removeCircuit,
} from '../../api/circuits/methods.js';

import {
  insertElement,
} from '../../api/elements/methods.js';

import {
  insertWire,
  updateWireD,
  updateWireName,
  updateWirePins,
  removeWire,
} from '../../api/wires/methods.js';

import { displayError } from '../lib/errors.js';

Template.Circuits_show.onCreated(function circuitShowOnCreated() {
  Session.setDefault('component2add', false);
//  Session.set( "component2add", false);
  Session.setDefault( "selectedPin", false);

  this.autorun(() => {
    new SimpleSchema({
      circuit: { type: Function },
      elementsReady: { type: Boolean },
      elements: { type: Mongo.Cursor },
//      wiresReady: { type: Boolean },
      wires: { type: Mongo.Cursor },
    }).validate(Template.currentData());
  });

  this.state = new ReactiveDict();
  this.state.setDefault({
    adding: false,
    wiring: false,
    selectedWire: false,
    selected: false,
    selectedElement: false,
    editing: false,
    editingElement: false,
    menuPosition: false,
  });

  this.selectElement = (e) => {
    this.state.set('selectedElement', e._id);
  };

  this.diselectElement = () => {
    this.state.set('selectedElement', false);
  };

  this.saveCircuit = () => {
    this.state.set('editing', false);

    updateCircuitName.call({
      cid: this.data.circuit()._id,
      newName: this.$('[name=name]').val(),
    }, displayError);
  };

  this.editCircuit = () => {
    this.state.set('editing', true);

    // force the template to redraw based on the reactive change
    Tracker.flush();
    // TODO -- I think velocity introduces a timeout before actually setting opacity on the
    //   element, so I can't focus it for a moment.
    Meteor.defer(() => {
      this.$('.js-edit-form input[type=text]').focus();
    });
  };

  this.deleteCircuit = () => {
    const circuit = this.data.circuit();
    const message = `${TAPi18n.__('Are you sure you want to delete the circuit')} ${circuit.name}?`;

    if ( confirm(message) ) { // eslint-disable-line no-alert
      removeCircuit.call({
        circuitId: circuit._id,
      }, displayError);

      FlowRouter.go('App.home');
      return true;
    }

    return false;
  };

  this.toggleCircuitPrivacy = () => {
    const circuit = this.data.circuit();
    if (circuit.userId) {
      makeCircuitPublic.call({ circuitId: circuit._id }, displayError);
    } else {
      makeCircuitPrivate.call({ circuitId: circuit._id }, displayError);
    }
  };
});

Template.Circuits_show.onRendered(function circuitShowOnRendered() {
});


Template.Circuits_show.helpers({
  adding() {
    const instance = Template.instance();
    return instance.state.get('adding');
  },
  addingClass() {
    const instance = Template.instance();
    if( Session.get( "component2add" ) ){
      instance.state.set('adding', true);
    }
    return instance.state.get('adding') ? "adding" : "";
  },
  editing() {
    // Circuit: Editing mode
    const instance = Template.instance();
    return instance.state.get('editing');
  },
  editingClass() {
    const instance = Template.instance();
    return instance.state.get('editing') ? "editing" : "";
  },
  wiring() {
    const instance = Template.instance();
    return instance.state.get('wiring');
  },
  wiringClass() {
    const instance = Template.instance();
    return instance.state.get('wire') ? "wiring" : "";
  },
  activewire() {
    const instance = Template.instance();
    return instance.state.get('wire');
  },
  selectedWire() {
    const instance = Template.instance();
    return instance.state.get('selectedWire');
  },
  selectedElement() {
    const instance = Template.instance();
    return instance.state.get('selectedElement');
  },
  cancel() {
    const instance = Template.instance();
    return instance.state.get('editing') || instance.state.get('selectedElement');
  },
  elementArgs(element) {
    const instance = Template.instance();
    return {
      element,
      symbol: Symbols.findOne({'key': element.symbol}),
      editing: instance.state.get('editing'),
      selected: instance.state.equals('selectedElement', element._id),
      setSelected(selected) {
        instance.state.set('selectedElement', selected ? element._id : false);
      },
    };
  },
  wireArgs(wire) {
    const instance = Template.instance();
    return {
      wire,
      wiring: instance.state.get('wiring'),
      selected: instance.state.equals('selectedWire', wire._id),
      setSelected(selected) {
        instance.state.set('selectedWire', selected ? wire._id : false);
      },
    }
  },
  elementMenuArgs() {
    const instance = Template.instance();
    const eid = instance.state.get('selectedElement');
    const element = Elements.findOne({ _id: eid});
    return {
      element: element,
//      menuPosition: instance.state.get('menuPosition'),
      setSelected(selected) {
        instance.state.set('selectedElement', selected ? element._id : false);
      },
    }
  },
  wireMenuArgs() {
    const instance = Template.instance();
    const wid = instance.state.get('selectedWire');
    const wire = Wires.findOne({ _id: wid});
    return {
      wire: wire,
      menuPosition: instance.state.get('menuPosition'),
      setSelected(selected) {
        instance.state.set('selectedWire', selected ? wire._id : false);
      },
    }
  },

});

Template.Circuits_show.events({
  'click .js-circuit-canvas.adding'(event, instance){
    event.preventDefault();
    const data = instance.data;
    const offset = instance.$('.js-circuit-canvas').offset();
    const newElement = Session.get( "component2add" );

    const element = {
      component: newElement.name,
      type: newElement.type,
      symbol: newElement.symbol,
//      pins: newElement.pins,
      cid: data.circuit()._id,
      transform: {x: event.pageX-offset.left, y: event.pageY-offset.top}
    };
    insertElement.call( element, displayError);
  },

  'mouseenter .js-pin'(event, instance) {
    const pin = this.element.name +"-"+ this.pin.id
    console.log( "MOUSEENTER on PIN "+ pin);
    const mx = new Snap.Matrix();
    mx.translate(this.element.transform.x, this.element.transform.y)
    const rot = this.element.transform.rot;
    if( rot ) {
      mx.rotate(this.element.transform.rot)
    }
    const px = mx.x(this.pin.x, this.pin.y);
    const py = mx.y(this.pin.x, this.pin.y);
    const s = Snap('.js-circuit-canvas');
    const activePin = s.circle( px, py, 10);
    activePin.attr({
      'class': "active js-active-pin",
      'data-id': pin,
      'data-element': this.element.name,
    });
  },

  'mouseleave .js-active-pin'(event, instance) {
    const pin = instance.$('.js-active-pin').data('id');
    const s = Snap('.js-circuit-canvas');
    s.select('.js-active-pin').remove();
  },

  'click .js-active-pin'(event, instance) {
    const $pin = instance.$('.js-active-pin');
    const pin = $pin.data('id');
    console.log( "CLICK on PIN "+ pin);
    const px = $pin.attr('cx');
    const py = $pin.attr('cy');
    let d = "";
    if( instance.state.get('wire') ){
      if( !instance.state.equals('startPin', pin) ) {
        console.log( "Stop wiring" );
        const wid = instance.state.get('wire');
        const s = Snap('.js-circuit-canvas');
        d = s.select("#"+wid).attr("d");
        d = d + " V "+ py +" H "+ px;
        updateWireD.call( {wid, newD:d}, displayError);
        updateWirePins.call( {wid, newPin:pin}, displayError);
      }
      else {
        console.log( "Cancel wiring" );
      }
      instance.state.set('wire', false);
      instance.state.set('startPin', false);
    }
    else{
      console.log( "Start wiring" );
      instance.state.set('wiring', true);
      instance.state.set('startPin', pin);
      d = "M"+px+" "+py;
      const wire = {
  //      type: ,
        d: d,
        pins: [pin],
        cid: instance.data.circuit()._id,
      };
      const wid = insertWire.call( wire, displayError);
      instance.state.set('wire', wid);
    }
  },

  'mousemove .js-circuit-canvas.wiring'(event, instance){
    const offset = instance.$(event.currentTarget).offset();
    const wid = instance.state.get('wire');
    const d = Wires.findOne({_id: wid}, { fields: {'d': 1,} }).d;
    const X = event.pageX-offset.left;
    const Y = event.pageY-offset.top;
    const s = Snap('.js-circuit-canvas');
    const p = s.select("#"+wid);
    p.attr("d", d + " V "+ Y +" H "+ X);
  },

  'click .js-circuit-canvas.wiring'(event, instance){
    const offset = instance.$(event.currentTarget).offset();
    const wid = instance.state.get('wire');
    const s = Snap('.js-circuit-canvas');
    const d = s.select("#"+wid).attr("d");
    console.log( d );
    updateWireD.call( {wid, newD:d}, displayError);
  },

  'click .wire'(event, instance) {
    console.log( "CLICK on WIRE " );
    const offset = instance.$('.js-circuit-canvas').offset();
    const X = event.pageX-offset.left;
    const Y = event.pageY-offset.top;
    const wid = instance.state.get('wire');
    if( wid ) {
      console.log( "Stop wiring" );
//      const wid = instance.state.get('wire');
      const s = Snap('.js-circuit-canvas');
      d = s.select("#"+wid).attr("d");
      d = d + " V "+ Y +" H "+ X;
      updateWireD.call( {wid, newD:d}, displayError);
      instance.state.set('wire', false);
      instance.state.set('startPin', false);
    }
    else {
      this.selected ? this.setSelected( false ) : this.setSelected( true );
      instance.state.set( 'menuPosition', "translate("+X+","+Y+")" );
    }
  },

  'mousedown .js-cancel, click .js-cancel'(event, instance) {
    event.preventDefault();
    instance.state.set('adding', false);
    instance.state.set('editing', false);
  },

  'keydown input[type=text]'(event) {
    // ESC
    if (event.which === 27) {
      event.preventDefault();
      $(event.target).blur();
    }
  },
/*
  'blur input[type=text]'(event, instance) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (instance.state.get('editing')) {
      instance.saveCircuit();
    }
  },
*/
  'submit .js-edit-form'(event, instance) {
    console.log( "SUBMIT TITLE" );
    event.preventDefault();
    instance.saveCircuit();
  },

  // This is for the mobile dropdown
  'change .circuit-edit'(event, instance) {
    const target = event.target;
    if ($(target).val() === 'edit') {
      instance.editCircuit();
    } else if ($(target).val() === 'delete') {
      instance.deleteCircuit();
    } else {
      instance.toggleCircuitPrivacy();
    }

    target.selectedIndex = 0;
  },

  'click .js-edit-circuit'(event, instance) {
    console.log( "CLICK EDITING" );
    instance.editCircuit();
  },

  'click .js-circuit-canvas'(event, instance) {
//    console.log( "CLICK CANVAS" );
//    console.log( instance.state.get('selectedElement') );
//    if( instance.state.get('selectedElement') ) {
//      instance.diselectElement();
//    }
  },

  'click .js-toggle-circuit-privacy'(event, instance) {
    instance.toggleCircuitPrivacy();
  },

  'click .js-delete-circuit'(event, instance) {
    console.log( "CLICK DELETE" );
    instance.deleteCircuit();
  },

  'click .js-element-add'(event, instance) {
    instance.$('.js-element-new input').focus();
  },

  'submit .js-element-new'(event) {
    event.preventDefault();

    const $input = $(event.target).find('[type=text]');
    if (!$input.val()) {
      return;
    }

    insertElement.call({
      circuitId: this.circuit()._id,
      text: $input.val(),
    }, displayError);

    $input.val('');
  },
});
