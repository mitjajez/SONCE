import { Template } from 'meteor/peerlibrary:blaze-components';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Snap from 'snapsvg';

import { Elements } from '../../api/elements/elements.js';
import { Symbols } from '../../api/symbols/symbols.js';
import { Wires } from '../../api/wires/wires.js';

import { displayError } from '../lib/errors.js';

// Component used in the template
import './elements-item.js';
import './wires-item.js';
import './command-box.js';
import './element-info.js';
//import './info-box.js';
//import './edit-menu.js';
import './element-edit-menu.js';
import './wire-edit-menu.js';
import './operations.js';
import './active-element.js';
import './active-pin.js';

import './circuits-show.html';

import {
  insertElement,
} from '../../api/elements/methods.js';

import {
  insertWire,
  updateWireD,
  updateWireName,
  updateNetName,
  addWireEnd,
  removeWire,
} from '../../api/wires/methods.js';

Template.Circuits_show.onCreated(function circuitShowOnCreated() {
  Session.setDefault('component2add', false);

  this.state = new ReactiveDict();
  this.state.setDefault({
    acting: 'viewing',    // viewing | editing | adding | wiring
    active: false,        // element | wire | net | node
    selection: false,     //
    dragging: false,      // panning | dragging
    menuPosition: false,  // element center | click coords on wire
    wiringMode: 'axis-x', // ['a-x', 'a-l', 'l', 'l-a', 'a-y']
    svgOffset: false,
    dragOffset: false,
    zoom: 1,
    pan: {x:0, y:0},
    mouse: {x:0, y:0},
  });

  this.autorun(() => {
    new SimpleSchema({
      circuit: { type: Function },
      elements: { type: Mongo.Cursor },
      wires: { type: Mongo.Cursor },
      subscriptionsReady: { type: Boolean },
    }).validate(Template.currentData());

    if( Session.get( 'component2add' ) ){
      this.state.set('acting', 'adding');
    }
  });


// ########## SVG related ######################################################

  this.getEventPoint = (event, mode) => {
    const gridSpace = 10;
    let X = 0; let Y = 0;
//    if (typeof event.pointerType === 'undefined') {
//      console.log( event );
//    }

    if (event.type.indexOf('mouse') > -1) {
      //event.type === 'mousemove'
      if(mode === 'svg') {
        const C = Snap('.js-circuit-canvas').select('.js-circuit');
        const t = C.transform().globalMatrix.split();
        X = (event.offsetX - t.dx) / t.scalex;
        Y = (event.offsetY - t.dy) / t.scaley;
      }
      else {
        X = event.offsetX;
        Y = event.offsetY;
      }
    }
    else if (event.pointerType === 'mouse') {
      if(mode === 'svg') {
        const C = Snap('.js-circuit-canvas').select('.js-circuit');
        const t = C.transform().globalMatrix.split();
        X = (event.layerX - t.dx) / t.scalex;
        Y = (event.layerY - t.dy) / t.scaley;
      }
      else {
        X = event.layerX;
        Y = event.layerY;
      }
    }
    else if(event.pointerType === 'touch'){
      if(mode === 'svg') {
        const C = Snap('.js-circuit-canvas').select('.js-circuit');
        const t = C.transform().globalMatrix.split();
        X = event.deltaX / t.scalex;
        Y = event.deltaY / t.scaley;
      }
      else {
        X = event.deltaX;
        Y = event.deltaY;
      }
    }
    return {
      x: Math.round(X/gridSpace) * gridSpace,
      y: Math.round(Y/gridSpace) * gridSpace,
    };
  };

  this.zoom = (event) => {
    console.log('ZOOM');
    const C = Snap('.js-circuit-canvas').select('.js-circuit');
    if(event.type === 'pinch') {

    }
    else {
      const T = this.getEventPoint(event, 'svg');
      const z = event.originalEvent.deltaY > 0 ? 0.9 : 1.1;
      const t = C.transform().globalMatrix.scale(z, z, T.x, T.y);
//      C.transform(t);

      const out = t.split();
      this.state.set('zoom', out.scalex );
      this.state.set('pan', {x: out.dx*1, y: out.dy*1} );
    }
  };

  this.pan = (event) => {
    console.log('PAN');
    const C = Snap('.js-circuit-canvas').select('.js-circuit');
    if(event.type === 'pan'){
      if(!this.state.get('dragOffset')){
        this.state.set('dragOffset', this.state.get('pan') );
      }
      const off = this.state.get('dragOffset' );
      const dT = this.getEventPoint(event, 'svg');
      if(event.srcEvent.type === 'touchmove') {
        this.state.set('pan', {x: (off.x+dT.x), y: (off.y+dT.y)} );
      }
      if(event.srcEvent.type === 'touchend') {
        this.state.set('dragOffset', false );
      }
    }
    else {
      const T = this.getEventPoint(event, 'svg');
      const T0 = this.state.get('dragOffset');
      const t =  C.transform().globalMatrix.translate(T.x - T0.x, T.y - T0.y);
//        sCircuit.transform(t);
      const out = t.split();
      this.state.set('pan', {x: out.dx*1, y: out.dy*1} );
    }
  };

// ########## wiring ###########################################################

  this.wiringModes = ['axis-x', 'axis-line', 'line', 'line-axis', 'axis-y'];

  this.getWiringMode = () => {
    return this.state.get('wiringMode');
  };

  this.setWiringMode = (mode) => {
    this.state.set('wiringMode', mode);
  };

  this.getLastPoint = (d) => {
    const p = {x:0, y:0};
    d.map((s) => {
      switch (s[0]) {
      case 'M':
        p.x = s[1];
        p.y = s[2];
        break;
      case 'm':
        p.x += s[1];
        p.y += s[2];
        break;
      case 'H':
        p.x = s[1];
        break;
      case 'h':
        p.x += s[1];
        break;
      case 'V':
        p.y = s[1];
        break;
      case 'v':
        p.y += s[1];
        break;
      case 'L':
        p.x = s[1];
        p.y = s[2];
        break;
      case 'l':
        p.x += s[1];
        p.y += s[2];
        break;
      default:
        console.log(`${s[0]} Not supported!`);
      }
      // console.log( `${i}: ${s} -> (${p.x},${p.y})`);
    });
    return p;
  };

  this.newWirePathPoint = (x, y) => { // ['a-x', 'a-l', 'l', 'l-a', 'a-y']
    const d = this.$('.js-active-wire').data().wire.d;
    let p = {x:0, y:0};
    if(d) {
      p = this.getLastPoint(Snap.parsePathString(d));
    }

    let str = '';
    let dl = 0;
    switch (this.state.get('wiringMode')) {
    case 'axis-x':
      str = ` H${x} V${y}`;
      break;
    case 'axis-line':
      if( Math.abs(x-p.x) > Math.abs(y-p.y) ) {
        dl = Math.abs(y-p.y);
        str = x > p.x ? ` H${x-dl}` : ` H${x+dl}`;
        str += x > p.x ? ` l${dl}` : ` l${-dl}`;
        str += y > p.y ? `,${dl}` : `,${-dl}`;
      }
      else {
        dl = Math.abs(x-p.x);
        str = y > p.y ? ` V${y-dl}` : ` V${y+dl}`;
        str += x > p.x ? ` l${dl}` : ` l${-dl}`;
        str += y > p.y ? `,${dl}` : `,${-dl}`;
      }
      break;
    case 'line':
      str = ` L${x},${y}`;
      break;
    case 'line-axis':
      if(Math.abs(x-p.x) > Math.abs(y-p.y)){ // LH ...
        dl = Math.abs(y-p.y);
        str = x > p.x ? ` l${dl}` : ` l${-dl}`;
        str += y > p.y ? `,${dl}` : `,${-dl}`;
        str += ` H${x}`;
      }
      else { // LV
        dl = Math.abs(x-p.x);
        str = x > p.x ? ` l${dl}` : ` l${-dl}`;
        str += y > p.y ? `,${dl}` : `,${-dl}`;
        str += ` V${y}`;
      }
      break;
    case 'axis-y':
      str = ` V${y} H${x}`;
      break;
    default:
    }
    return str;
  };

  this.focusCli = () => {
    this.$('.command-box input[name="command-line"]').focus();
  };

});

Template.Circuits_show.onRendered(function circuitShowOnRendered() {
});


Template.Circuits_show.helpers({
  mouse: () => Template.instance().state.get('mouse'),
  zoom: () => Template.instance().state.get('zoom'),
  pan: () => Template.instance().state.get('pan'),
  viewzoom() {
    return (Template.instance().state.get('zoom')*100).toFixed();
  },
  viewPan() {
    const pan = Template.instance().state.get('pan');
    return `${(pan.x).toFixed()},${(pan.y).toFixed()},`;
  },

  actingClass: () => Template.instance().state.get('acting'),
  active: () => Template.instance().state.get('active'),
  selection: () => Template.instance().state.get('selection'),

  viewing: () => Template.instance().state.equals('acting', 'viewing'),
  adding: () => Template.instance().state.equals('acting', 'adding'),
  editing: () => Template.instance().state.equals('acting', 'editing'),
  wiring: () => Template.instance().state.equals('acting', 'wiring'),
  wiringMode: () => Template.instance().state.get('wiringMode'),

  selectedElement: () => Template.instance().state.equals('active', 'element'),
  selectedWire: () => Template.instance().state.equals('active', 'wire') ||
                      Template.instance().state.equals('active', 'net'),

  cancel() {
    const state = Template.instance().state;
    return !state.equals('acting', 'viewing') || !state.equals('active', false);
  },
  elementArgs(element) {
    const instance = Template.instance();
    return {
      element,
      'symbol': Symbols.findOne({'key': element.symbol}),
      'editing': instance.state.equals('acting', 'editing'),
      'selected': instance.state.equals('selection', element._id),
      setSelected(select) {
        instance.state.set('selection', select ? element._id : false);
        instance.state.set('active', select ? 'element' : false);
      },
    };
  },
  wireArgs(wire) {
    const instance = Template.instance();
    return {
      wire,
      wiring: instance.state.equals('acting', 'wiring'),
      selected: instance.state.equals('selection', wire._id),
      setSelected(select) {
        instance.state.set('selection', select ? wire._id : false);
        instance.state.set('active', select ? 'wire' : false);
      },
    };
  },
  elementMenuArgs() {
    const instance = Template.instance();
    const eid = instance.state.get('selection');
    return {
      element: Elements.findOne({ _id: eid}),
      cid: this.circuit()._id,
      active: instance.state.get('active'),       // migrate to MenuArgs
      selection: instance.state.get('selection'),
      menuPosition: instance.state.get('menuPosition'),
      setSelected(doSelect) {
        instance.state.set('selection', doSelect ? eid : false);
        instance.state.set('active', doSelect ? 'element' : false);
      },
    };
  },
  wireMenuArgs() {
    const instance = Template.instance();
    const wid = instance.state.get('selection');
    return {
      cid: this.circuit()._id,
      active: instance.state.get('active'),       // migrate to MenuArgs
      selection: instance.state.get('selection'),
      menuPosition: instance.state.get('menuPosition'),
      setSelected(select) {
        instance.state.set('selection', select ? wid : false);
        instance.state.set('active', select ? 'wire' : false);
      },
    };
  },

  templateGestures: {
    'pan .js-circuit-canvas'(event, instance) {
      event.preventDefault();
      instance.pan(event);
    },
    'pinch .js-circuit-canvas'(event, instance) {
      event.preventDefault();
      instance.zoom(event);
    },
  },
});


Template.Circuits_show.events({
  // SELECTING -----------------------------------------------------------------
  'click .js-select-element'(event, instance) {
    event.preventDefault();
    this.selected ? this.setSelected(false) : this.setSelected(true);
    const p = this.element.transform;
    instance.state.set('menuPosition', `translate(${p.x},${p.y})`);
  },

  'dblclick .js-circuit-element'(event, instance) {
    event.preventDefault();
    instance.state.set('selection', this.element._id);
    instance.state.set('active', 'element');
    instance.state.set('acting', 'editing');
    instance.focusCli();
  },

  'click .viewing .js-wire, click .editing .js-wire' (event, instance) {
    event.preventDefault();
    const p = instance.getEventPoint(event, 'svg');
    instance.state.set('menuPosition', `translate(${p.x},${p.y})`);
    this.setSelected(true);
  },

  // COMMON --------------------------------------------------------------------
  'click .js-view-circuit' (event, instance) {
    event.preventDefault();
    instance.state.set('acting', 'viewing');
  },

  'click .js-edit-circuit' (event, instance) {
    event.preventDefault();
    instance.state.set('acting', 'editing');
  },

  'click .js-wire-circuit' (event, instance) {
    event.preventDefault();
    instance.state.set('acting', 'wiring');
  },

  'click .js-cancel-selection' (event, instance) {
    instance.state.set('selection', false);
    instance.state.set('active', false);
  },

  'wheel .js-circuit-canvas'(event, instance) {
    instance.zoom(event);
  },

  'mousedown .js-circuit-canvas'(event, instance){
    event.preventDefault();
    if( instance.$(event.target).is('svg.js-circuit-canvas') ){
      instance.state.set('dragging', 'panning'); //panning | moving
    }
    else if ( instance.$(event.target).is('.js-select-element') ) {
      // copy element to js-active-element
      instance.state.set('dragging', 'moving'); //panning | moving
      // instance.$('js-active-element').attr('visibility', 'visable');
    }
    const T = instance.getEventPoint(event, 'svg');
    instance.state.set('dragOffset', T);
    console.log('drag starts');
  },

  'mouseup .js-circuit-canvas'(event, instance){
    event.preventDefault();
    instance.state.set('dragging', false);
    console.log('drag stops');
  },

  'mousemove .js-circuit-canvas'(event, instance) {
    event.preventDefault();
    const pos = instance.getEventPoint(event, 'svg');
    instance.state.set('mouse', {x:pos.x, y:pos.y} );

    if( instance.state.equals('dragging', 'panning') ){
      instance.pan(event);
    }
    if( instance.state.equals('dragging', 'moving') ){
      console.log('to MOVE');
//      instance.move(event);
    }
  },

  // ADDING --------------------------------------------------------------------
  'mouseenter .adding .js-circuit-canvas'(event, instance) {
    const newElement = Session.get('component2add');
    const symbolsSVG = Session.get('symbolsSVG');
    const $active = instance.$('.js-active-element');
    const $data = $active.data();
    $data.element = {
      component: newElement.key,
      type: newElement.type,
      symbol: newElement.symbol,
      cid: this.circuit()._id,
      pins: newElement.pins,
    };
    $data.element.pins.forEach( (pin) => {
      pin.net = 'open';
    });

    if(!$data.element.transform){
      $data.element.transform = {x:0, y:0, rot:0};
    }

    const s = Snap('.js-active-element').select('use');
    s.attr({
      'xlink:href': `${symbolsSVG}#${newElement.symbol}`,
    });
    $active.attr({'visibility': 'visible'});
    instance.$('input[name=command-line]').focus();
  },

  'mousemove .adding .js-circuit-canvas'(event, instance) {
    const p = instance.getEventPoint(event, 'svg');
    const $active = instance.$('.js-active-element');
    const t = $active.data().element.transform;
    t.x = p.x;
    t.y = p.y;
    $active.attr({
      'transform': `translate(${t.x},${t.y}) rotate(${t.rot})`,
    });
  },

  'click .adding .js-circuit-canvas'(event, instance) {
    const newElement = instance.$('.js-active-element').data().element;
    console.log( newElement );
    insertElement.call( newElement, displayError);
  },

  'keyup .adding input[name=command-line]' (event, instance) {
    console.log( 'keyup .adding' );
    if (event.which === 82) { // r
      console.log('--> r ... rotate');
      const $active = instance.$('.js-active-element');
      const t = $active.data().element.transform;
      t.rot += 90;
      if(t.rot > 360) t.rot = 0;
      instance.$('input[name=command-line]').val('');
    }
  },


  // WIRING --------------------------------------------------------------------
  'mouseenter .js-pin' (event, instance) {
    const $pin = instance.$(event.currentTarget);
    const cx = $pin.attr('cx');
    const cy = $pin.attr('cy');
    const $data = $pin.data();
    const mx = new Snap.Matrix();
    const t = this.element.transform;
    mx.translate(t.x, t.y);
    if( t.rot ) mx.rotate(t.rot);
    const p = {x: mx.x(cx, cy), y: mx.y(cx, cy)};

    const $active = instance.$('.js-active-pin');
    $active.data({
      'e': $data.element,
      'p': $data.id,
    });
    $active.attr({
      'id': $pin.attr('id'),
      'cx': p.x,
      'cy': p.y,
      'visibility': 'visable',
    });
  },

  'mouseleave .js-active-pin' (event, instance) {
    const $pin = instance.$('.js-active-pin');
    $pin.attr({'visibility': 'hidden'});
  },

  'click .wiring .js-active-pin' (event, instance) {
    const $pin = instance.$( '.js-active-pin' );
    const p = {
      id: $pin.attr('id'),
      x: $pin.attr('cx'),
      y: $pin.attr('cy'),
    };
    const pData = $pin.data();
    const $wire = instance.$('.js-active-wire');
    const w = $wire.data().wire;
    console.log( 'CLICK on PIN '+ p.id );

    if (instance.state.get('selection') &&
    instance.state.equals('active', 'wire') ) {
      // end this wire
      if( instance.state.equals('startWire', p.id) ) {
        // remove all about this wire
        console.log( '--> Cancel wiring' );
        if( !instance.state.equals('selection', '.js-active-wire')) {
          removeWire.call({
            wid: instance.state.get('selection'),
          }, displayError);
        }
      }
      else {
        console.log( '--> Stop wiring' );
        w.d += instance.newWirePathPoint(p.x, p.y);
        w.ends.push({e: pData.e, p: `${pData.p}`});
        if( instance.state.equals('selection', '.js-active-wire') ){
          // insert new wire
          insertWire.call({
            name: w.name,
            d:    w.d,
            ends: w.ends.map( function(end) { return {e: end.e, p: end.p+''} }),
            cid:  w.cid,
          }, displayError);
        }
        else {
          // update exist wire
          const wid = instance.state.get('selection');
          updateWireD.call({ wid, newD: w.d }, displayError);
          addWireEnd.call({
            wid,
            newEnd: {e: pData.e, p: `${pData.p}`},
          }, displayError);
        }
      }
      // instance.stopWire();
      $wire.attr({ 'visibility': 'hidden', 'd': '' });
      $wire.data().wire = {};
      instance.state.set('active', false);
      instance.state.set('selection', false);
      instance.state.set('startWire', false);
    }
    else {
      // start new wire
      instance.state.set('startWire', p.id);
      $wire.data().wire = {
        ends: [{e: pData.e, p: `${pData.p}`}],
        cid: instance.data.circuit()._id,
        d: `M${p.x},${p.y}`,
      };
      $wire.attr({ visibility: 'visible' });
      instance.state.set('active', 'wire');
      instance.state.set('selection', '.js-active-wire');
      instance.focusCli();
      console.log( '  --> Start wiring' );
    }
  },
  'click .wiring .js-circuit-canvas' (event, instance) {
    if(instance.$(event.currentTarget).is('.js-circuit-canvas') &&
    !instance.state.equals('startWire', false) ) {
      console.log( 'CLICK on SVG ACTIVE WIRE' ); // testing
    }
  },

  'click .wiring .js-active-wire'(event, instance){
    console.log( 'CLICK on ACTIVE WIRE' );
    const p = instance.getEventPoint(event, 'svg');
    const w = instance.$('.js-active-wire').data().wire;
    w.d += instance.newWirePathPoint(p.x, p.y);
    if ( instance.state.equals('selection', '.js-active-wire') ) {
      const wid = insertWire.call({
        d: w.d,
        ends: w.ends.map( (end) => { return { e: end.e, p: `${end.p}` }; }),
        cid: w.cid,
      }, displayError);
      instance.state.set('selection', wid);
      w.name = Wires.findOne(wid).name;
    }
    else {
      const wid = instance.state.get('selection');
      updateWireD.call( {wid, newD:w.d}, displayError);
    }
    instance.focusCli();
  },

  'click .wiring .js-wire'(event, instance) {
    const name = instance.$(event.currentTarget).attr('name');
    const p = instance.getEventPoint(event, 'svg');
    console.log( 'CLICK on WIRE '+ name );
    const $wire = instance.$('.js-active-wire');
    const $wData = $wire.data();
    const w = $wData.wire;

    if (instance.state.get('selection') &&
    instance.state.equals('active', 'wire') ) {
      // end this wire
      console.log( '--> Stop wiring' );
      const start = instance.state.get('startWire');
      console.log( 'start: ' + start );
      console.log( 'selection: ' + instance.state.get('selection') );
      console.log( 'name: ' + name);
      console.log( 'w.name: ' + w.name);


      if ( !instance.state.equals('selection', '.js-active-wire') &&
      w.name !== name) {
        console.log('CONFLICT: '+ w.name +' !== '+ name +'; merge to?');
        // TODO: prompt here
        updateNetName.call({
          cid: w.cid, net:w.name, newName: name,
        }, displayError);
        w.name = name;
      }

      w.d += instance.newWirePathPoint(p.x, p.y);
      if ( instance.state.equals('selection', '.js-active-wire') ){
        // instance.insertWire(wire);
        w.ends.push({e: 'node', p: 'new'});
        w.name = name;
        insertWire.call({
          name: w.name,
          d: w.d,
          ends: w.ends.map( function(end) { return {e: `${end.e}`, p: `${end.p}`}; }),
          cid: w.cid,
        }, displayError);
      }
      else {
        // instance.endWire(d,end);
        const wid = instance.state.get('selection');
        updateWireD.call({ wid, newD: w.d}, displayError);
        addWireEnd.call({
          wid,
          newEnd: { e: 'node', p: 'new' },
        }, displayError);
        updateWireName.call({
          wid,
          newName: w.name,
        }, displayError);

      }
      // instance.stopWire();
      $wire.attr({ 'visibility': 'hidden', 'd': '' });
      $wire.data().wire = {};
      instance.state.set('active', false);
      instance.state.set('selection', false);
      instance.state.set('startWire', false);
    }
    else {
      // start new wire
      console.log( '  --> Start wiring' );
      instance.state.set('startWire', name);
      $wData.wire = {
        name,
        ends: [{e: 'node', p: 'new'}],
        cid: instance.data.circuit()._id,
        d: `M${p.x},${p.y}`,
      };
      $wire.attr({ visibility: 'visible' });
      instance.state.set('active', 'wire');
      instance.state.set('selection', '.js-active-wire');
      instance.focusCli();
    }
  },

  'mousemove .wiring .js-circuit-canvas'(event, instance){
    const $wire = instance.$('.js-active-wire');
    if ( $wire.attr('visibility') === 'visible') {
      const p = instance.getEventPoint(event, 'svg');
      $wire.attr('d', $wire.data().wire.d + instance.newWirePathPoint(p.x, p.y));
    }
  },

  'keyup .wiring input[name=command-line]' (event, instance) {
    console.log( 'keydown .wiring' );
    const $cli = instance.$('input[name=command-line]');
    if (event.which === 87) {
      console.log('--> w ... wiring mode');
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
      console.log( '--> ESC');
      const $active = instance.$('.js-active-wire');
      $active.attr({
        'visibility': 'hidden',
        'd': '',
      });
      $active.data().wire = {};
      const wid = instance.state.get('selection');
      if(wid && !instance.state.equals('selection', '.js-active-wire')) {
        removeWire.call({ wid }, displayError);
      }
      instance.state.set('active', false);
      instance.state.set('selection', false);
      instance.state.set('startPin', false);

    }
    $cli.val('');
  },

  // CANCELING -----------------------------------------------------------------
  'mousedown .js-cancel, click .js-cancel'(event, instance) {
    event.preventDefault();
    if(Session.get( 'component2add' )){
      Session.set( 'component2add', false );
      instance.state.set('acting', 'viewing');
      instance.$('.js-active-element').attr({'visibility': 'hidden'});
    }
    else if ( instance.state.get('active') || instance.state.get('selection')) {
      instance.state.set('active', false);
      instance.state.set('selection', false);
    }
    else {
      instance.state.set('acting', 'viewing');
    }
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
    console.log( 'CLICK EDITING' );
    instance.state.set('acting', 'editing');
  },
});
