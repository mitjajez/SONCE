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
import './active-element.js';
import './active-pin.js';
import './active-wire.js';

import {
  updateCircuitName,
  makeCircuitPublic,
  makeCircuitPrivate,
  removeCircuit,
} from '../../api/circuits/methods.js';

import {
  insertElement,
  rotateElement,
  updateElementText,
  removeElement,
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
  Session.setDefault('selectedPin', false);

  this.state = new ReactiveDict();
  this.state.setDefault({
    acting: 'viewing',    // viewing | editing | adding | wiring
    active: false,        // element | wire | pin
    selection: false,     //
    menuPosition: false,  // element center | click coords
    wiringMode: "HV",     // HV | VH | LV | LH | L |
    svgOffset: false,
  });

  this.autorun(() => {
    new SimpleSchema({
      circuit: { type: Function },
      elements: { type: Mongo.Cursor },
      wires: { type: Mongo.Cursor },
      elementsReady: { type: Boolean },
//      wiresReady: { type: Boolean },
    }).validate(Template.currentData());

    if( Session.get( "component2add" ) ){
      this.state.set('acting', "adding");
    }

  });

  this.getEventPoint = (event) => {
    if( !this.state.equals('svgOffset') ){
      const svgOffset = this.$('.js-circuit-canvas').offset();
      this.state.set('svgOffset', svgOffset);
    }
    const offset = this.state.get('svgOffset');
    let X = event.pageX-offset.left;
    let Y = event.pageY-offset.top;
    X = Math.round(X/10) * 10;
    Y = Math.round(Y/10) * 10;
    return {x:X, y:Y};
  };

  this.wiringModes = ["HV", "VH", "LV", "LH", "L"];

  this.getWiringMode = () => {
    return this.state.get('wiringMode');
  };
  this.setWiringMode = (mode) => {
    this.state.set('wiringMode', mode);
  };
  this.newWirePoint = (x, y) => { // HV | VH | LV | LH | L |
    if( this.state.equals('wiringMode', "HV") ){
      return " V "+ y +" H "+ x;
    }
    if( this.state.equals('wiringMode', "VH") ){
      return " H "+ x +" V "+ y;
    }
    if( this.state.equals('wiringMode', "LV") ){
      return " L "+ x + " "+ x +" V "+ y;
    }
    if( this.state.equals('wiringMode', "LH") ){
      return " L "+ y + " "+ y +" H "+ x;
    }
    if( this.state.equals('wiringMode', "L") ){
      return " L "+ y + " "+ x;
    }
  };

  this.deleteCircuit = () => {
    const circuit = this.data.circuit();
    const message = `${TAPi18n.__('Are you sure you want to delete the circuit')} ${circuit.name}?`;

    if ( confirm(message) ) { // eslint-disable-line no-alert
      removeCircuit.call({
        cid: circuit._id,
      }, displayError);

      FlowRouter.go('App.home');
      return true;
    }

    return false;
  };

  this.toggleCircuitPrivacy = () => {
    const circuit = this.data.circuit();
    if (circuit.userId) {
      makeCircuitPublic.call({ cid: circuit._id }, displayError);
    } else {
      makeCircuitPrivate.call({ cid: circuit._id }, displayError);
    }
  };
});

Template.Circuits_show.onRendered(function circuitShowOnRendered() {
});


Template.Circuits_show.helpers({
  actingClass: () => Template.instance().state.get('acting'),
  active: () => Template.instance().state.get('active'),
  selection: () => Template.instance().state.get('selection'),

  adding: () => Template.instance().state.equals('acting', "adding"),
  editing: () => Template.instance().state.equals('acting', "editing"),
  wiring: () => Template.instance().state.equals('acting', "wiring"),
  wiringMode: () => Template.instance().state.get('wiringMode'),

  selectedElement: () => Template.instance().state.equals('active', "element"),
  selectedWire: () => Template.instance().state.equals('active', "wire"),

  cancel() {
    const state = Template.instance().state;
    return !state.equals('acting', "viewing") || !state.equals('active', false);
  },
  elementArgs(element) {
    const instance = Template.instance();
    return {
      element: element,
      symbol: Symbols.findOne({'key': element.symbol}),
      editing: instance.state.equals('acting', "editing"),
      selected: instance.state.equals('selection', element._id),
      setSelected(select) {
        instance.state.set('selection', select ? element._id : false);
        instance.state.set('active', select ? "element" : false);
      },
    };
  },
  wireArgs(wire) {
    const instance = Template.instance();
    return {
      wire: wire,
      wiring: instance.state.equals('acting', "wiring"),
      selected: instance.state.equals('selection', wire._id),
      setSelected(select) {
        instance.state.set('selection', select ? wire._id : false);
        instance.state.set('active', select ? "wire" : false);
      },
    }
  },
  elementMenuArgs() {
    const instance = Template.instance();
    const eid = instance.state.get('selection');
    const element = Elements.findOne({ _id: eid});
    return {
      element: element,
      setSelected(select) {
        instance.state.set('selection', select ? element._id : false);
        instance.state.set('active', select ? "element" : false);
      },
    }
  },
  wireMenuArgs() {
    const instance = Template.instance();
    const wid = instance.state.get('selection');
    const wire = Wires.findOne({ _id: wid});
    return {
      wire: wire,
      menuPosition: instance.state.get('menuPosition'),
      setSelected(select) {
        instance.state.set('selection', select ? wire._id : false);
        instance.state.set('active', select ? "wire" : false);
      },
    }
  },

});



Template.Circuits_show.events({
  // SELECTING -----------------------------------------------------------------
  'click .viewing .js-wire, click .editing .js-wire'(event, instance) {
    const p = instance.getEventPoint(event);
    instance.state.set( 'menuPosition', "translate("+p.x+","+p.y+")" );
    this.setSelected(true);
  },



  // ADDING --------------------------------------------------------------------
  'mouseenter .adding .js-circuit-canvas'(event, instance) {
    const newElement = Session.get("component2add");
    const symbolsSVG = Session.get("symbolsSVG");
    const $active = instance.$('.js-active-element');
    console.log( "newElement.key: "+ newElement.key );
    const $data = $active.data();
    if( !!$data.element ){
      console.log( "$data.element: "+ $data.element.component );
    }
    $data.element = {
        component: newElement.key,
        type: newElement.type,
        symbol: newElement.symbol,
        cid: this.circuit()._id,
    };
    console.log( "PO $data.element: "+ $data.element.component );
    if( !!$data.element.transform ){
      console.log( $data.element.transform );
    }

    if(!$data.element.transform){
      console.log( "UPDATE T!" );
      $data.element.transform = {x:0, y:0, rot:0};
    }
    const s = Snap('.js-active-element').select('use');
    s.attr({ 'xlink:href': symbolsSVG + "#"+ newElement.symbol });
    $active.attr({'visibility': "visible"});
    instance.$('input[name=command-line]').focus();
  },

  'mousemove .adding .js-circuit-canvas'(event, instance) {
    const p = instance.getEventPoint(event)
    const $active = instance.$('.js-active-element');
    const t = $active.data().element.transform;
    t.x = p.x;
    t.y = p.y;
    $active.attr({
      'transform': "translate("+ t.x +","+ t.y +") rotate("+ t.rot +")",
    });
  },

  'click .adding .js-circuit-canvas'(event, instance) {
    const newElement = instance.$('.js-active-element').data().element;
    console.log( "CLICK .adding ", newElement.component );
    insertElement.call( newElement, displayError);
  },


  'keydown .adding input[name=command-line]'(event, instance) {
    console.log( 'keydown .adding' );
    if (event.which === 82) {
      console.log("--> r ... rotate");
      const $active = instance.$('.js-active-element');
      const t = $active.data().element.transform;
      t.rot += 90;
      if(t.rot > 360) t.rot = 0;
      instance.$('input[name=command-line]').val("");
    }
  },




  // WIRING --------------------------------------------------------------------
  'mouseenter .editing .js-pin, mouseenter .wiring .js-pin '(event, instance) {
    $pin = instance.$(event.currentTarget);
    const cx = $pin.attr('cx');
    const cy = $pin.attr('cy');
    const $data = $pin.data();
    const mx = new Snap.Matrix();
    const t = this.element.transform;
    mx.translate(t.x, t.y);
    if( t.rot ) mx.rotate(t.rot);
    const px = mx.x(cx, cy);
    const py = mx.y(cx, cy);

    const $active = instance.$('.js-active-pin');
    $active.data({
      'id': $data.id,
      'element': $data.name,
    });
    $active.attr({
      'id': $pin.attr('id'),
      'cx': px,
      'cy': py,
      'visibility': "visable",
    });
    instance.state.set('active', "pin");
    instance.state.set('selection', $pin.attr('id'));
  },

  'mouseleave .editing .js-active-pin'(event, instance) {
    const $pin = instance.$('.js-active-pin');
    $pin.attr({'visibility': "hidden"});
    if ( instance.state.equals('active', "pin") ) {
      instance.state.set('active', false);
      instance.state.set('selection', false);
    }
  },

  'click .editing .js-active-pin'(event, instance) {
    const $pin = instance.$('.js-active-pin');
    const pid = $pin.attr('id');
    console.log( "CLICK on .editing PIN "+ pid);
    const px = $pin.attr('cx');
    const py = $pin.attr('cy');
    let d = "";
    console.log( "--> Start wiring" );
    instance.$('input[name=command-line]').focus();
    const cid = instance.data.circuit()._id
    const $wire = instance.$('.js-active-wire');
    const $data = $wire.data();
    instance.state.set('startPin', pid);
    d = "M"+px+" "+py;
    $data.pins = [pid];
    $data.cid = cid;
    $data.d = d;
    $wire.attr({ visibility: "visible" });
    instance.state.set('active', "wire");
    instance.state.set('selection', ".js-active-wire");
    instance.state.set('acting', "wiring");
  },

  'click .wiring .js-active-pin'(event, instance) {
    const $pin = instance.$('.js-active-pin');
    const pid = $pin.attr('id');
    console.log( "CLICK on .wiring PIN "+ pid);
    const px = $pin.attr('cx');
    const py = $pin.attr('cy');
    const wid = instance.state.get('selection');

    const $wire = instance.$('.js-active-wire');
    $wire.attr({'visibility': "hidden"});
    const $data = $wire.data();

    if( instance.state.equals('startPin', pid) ) {
      console.log( "--> Cancel wiring" );
      if(wid && !instance.state.equals('selection', ".js-active-wire")) {
        removeWire.call( {wid}, displayError);
      }
    }
    else {
      console.log( "--> Stop wiring" );
      $data.d += instance.newWirePoint(px, py);
      $data.pins.push(pid);
      if(wid && !instance.state.equals('selection', ".js-active-wire")) {
        updateWireD.call( {wid, newD:$data.d}, displayError);
        updateWirePins.call( {wid, newPin:pid}, displayError);
      }
      else{
        console.log( $data );
        const wire = {
          d: $data.d,
          pins: $data.pins,
          cid: $data.cid,
        };
        insertWire.call( wire, displayError);
      }
    }
    instance.state.set('acting', "editing");
    instance.state.set('active', "pin");
    instance.state.set('selection', false);
    instance.state.set('startPin', false);
  },

  'mousemove .wiring .js-circuit-canvas'(event, instance){
    const p = instance.getEventPoint(event)
    const $wire = instance.$('.js-active-wire');
    $wire.attr("d", $wire.data('d') + instance.newWirePoint(p.x, p.y));
  },

  'click .wiring .js-active-wire'(event, instance){
    console.log( "CLICK on .wiring ACTIVE WIRE" );
    const p = instance.getEventPoint(event);
    const $wire = instance.$('.js-active-wire');
    const $data = $wire.data();
    $data.d += instance.newWirePoint(p.x, p.y);
    if(instance.state.equals('selection', ".js-active-wire") ) {
      const wire = {
        d: $data.d,
        pins: $data.pins,
        cid: $data.cid,
      };
      const wid = insertWire.call( wire, displayError);
      instance.state.set('active', "wire");
      instance.state.set('selection', wid);
    }
    else {
      const wid = instance.state.get('selection');
      updateWireD.call( {wid, newD:$data.d}, displayError);
    }
    instance.$('input[name=command-line]').focus();
  },

  'click .wiring .js-wire'(event, instance) {
    instance.state.set('acting', "viewing");
    const name = instance.$(event.currentTarget).attr('name');
    const wid = instance.state.get('selection');
    console.log( "CLICK on .wiring WIRE "+ name + "( wiring: " +wid + ")" );
    const $data = instance.$('.js-active-wire').data();
    const p = instance.getEventPoint(event);
    if( wid && instance.state.equals('selection', ".js-active-wire") ){
      const wire = {
        name: name,
        d: $data.d + instance.newWirePoint(p.x, p.y),
        pins: $data.pins,
        cid: $data.cid,
      };
      insertWire.call( wire, displayError);
    }
    else {
      updateWireD.call( {wid, newD:$data.d}, displayError);
    }
    instance.state.set('selection', false);
    instance.state.set('startPin', false);
    console.log( "Stop wiring" );
  },

  'keydown .wiring input[name=command-line]'(event, instance) {
    console.log( 'keydown .wiring' );
    $cli = instance.$('input[name=command-line]');
    if (event.which === 87) {
      console.log("--> w ... wiring mode");
      const modes = instance.wiringModes;
      const mode = instance.getWiringMode();
      let iMode = _.indexOf(modes, mode) + 1;
      if(iMode === modes.length){
        iMode = 0;
      }
      instance.setWiringMode( modes[iMode] );
    }
    // ESC
    if (event.which === 27) {
      event.preventDefault();
      console.log( "--> ESC");
      instance.state.set('acting', "viewing");
      $active = instance.$('.js-active-wire');
      const wid = instance.state.get('selection');

      instance.state.set('selection', false);
      instance.state.set('startPin', false);

    }
    $cli.val("");
  },

  // CANCELING -----------------------------------------------------------------
  'mousedown .js-cancel, click .js-cancel'(event, instance) {
    event.preventDefault();
    if(Session.get( "component2add" )){
      Session.set( "component2add", false );
      instance.state.set('acting', "viewing");
      instance.$('.js-active-element').attr('visibility',"hidden");
    }
    else if ( instance.state.get('active') || instance.state.get('selection')) {
      instance.state.set('active', false);
      instance.state.set('selection', false);
    }
    else {
      instance.state.set('acting', "viewing");
    }
  },

  'submit .js-edit-form'(event, instance) {
    console.log( "SUBMIT TITLE" );
    event.preventDefault();
    instance.saveCircuit();
  },

  // This is for the mobile dropdown
  'change .js-action'(event, instance) {
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

  'click .js-edit'(event, instance) {
    console.log( "CLICK EDITING" );
    instance.state.set('acting', "editing");
  },

  'click .js-toggle-circuit-privacy'(event, instance) {
    instance.toggleCircuitPrivacy();
  },

  'click .js-delete-circuit'(event, instance) {
    console.log( "CLICK DELETE" );
    instance.deleteCircuit();
  },

  'click .js-element-add'(event, instance) {
    instance.$('.js-command-line input').focus();
  },

  'submit .js-element-new'(event) {
    event.preventDefault();

    const $input = $(event.target).find('[type=text]');
    if (!$input.val()) {
      return;
    }

    $input.val('');
  },
});
