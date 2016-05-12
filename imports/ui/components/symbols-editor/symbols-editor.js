import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';

import { Symbols } from '../../../api/symbols/symbols.js';

import './symbols-editor.html';
//import './symbol-image.js';

import {
  updateSymbol,
  removeSymbol,
} from '../../../api/symbols/methods.js';

import { displayError } from '../../lib/errors.js';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

Template.Symbols_editor.onCreated(function symbolsEditorOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      symbol: { type: Function },
      symbolReady: { type: Boolean },
    }).validate(Template.currentData());
  });

  this.state = new ReactiveDict();
  this.state.setDefault({
    editing: false,
    editingSymbol: false,
  });

  this.editSymbol = () => {
    this.state.set('editing', true);
    const symbol = this.data.symbol();
    if(!symbol.width){
      const symSVG = this.find('.js-symbol-svg');
      const s = Snap( symSVG );
      const g = s.select("#"+symbol.key);
      Meteor.defer(() => {
        const $w = this.$('[name=width]');
        $w.val( g.getBBox().width );
      });
    }

    // force the template to redraw based on the reactive change
    Tracker.flush();
    // TODO -- I think velocity introduces a timeout before actually setting opacity on the
    //   element, so I can't focus it for a moment.
    Meteor.defer(() => {
      this.$('.js-edit-form input[name=title]').focus();
    });
  };

  this.saveSymbol = () => {
    console.log( "SAVING" );
    this.state.set('editing', false);
    const symbolData = {};
    const symbol = this.data.symbol();

    const newKey = this.$('[name=key]').val().trim();
    if (newKey) {
      symbolData.key = newKey;
    }
    const newTitle = this.$('[name=title]').val().trim();
    if (newTitle) {
      symbolData.title = newTitle;
    }
    const newUnit = this.$('[name=unit]').val().trim();
    if (newUnit) {
      symbolData.unit = newUnit;
    }
    const newSvg = this.$('[name=svg]').val().trim();
    if (newSvg) {
      symbolData.svg = newSvg;
    }
    const newWidth = this.$('[name=width]').val().trim()*1;
    // parseInt
    if (newWidth) {
      symbolData.width = newWidth;
    }

    update.call({
      symbolId: this.data.symbol()._id,
      symbolData,
    }, displayError);
  };

  this.deleteSymbol = () => {
    const symbol = this.data.symbol();
    const message = `${TAPi18n.__('Are you sure you want to delete the symbol')} ${symbol.title}?`;

    if ( confirm(message) ) { // eslint-disable-line no-alert
      remove.call({
        symbolId: symbol._id,
      }, displayError);

      FlowRouter.go('App.home');
      return true;
    }

    return false;
  };
});

Template.Symbols_editor.helpers({
  symbolArgs(symbol) {
    const instance = Template.instance();
    return {
      symbol,
//      editing: instance.state.equals('editingSymbol', symbol._id),
//      onEditingChange(editing) {
//        return instance.state.set('editingSymbol', editing ? symbol._id : false);
//      },
    };
  },
  editingClass() {
    const instance = Template.instance();
    const editing = instance.state.get('editing');
    return editing ? "editing" : "";
  },
  editing() {
    const instance = Template.instance();
    return instance.state.get('editing');
  },
});

Template.Symbols_editor.onRendered(function symbolsEditorOnRendered() {
  const instance = Template.instance();
  const symbol = instance.data.symbol();
  const symSVG = instance.find('.js-symbol-svg');
  const $svgCode = instance.$('.svg-code');
  const s = Snap( symSVG );
  Snap.load(Session.get("symbolsSVG"), function (f) {
    const g = f.select("#"+symbol.key);
    const im = s.append(g);
    $svgCode.text( g.toString() );
  });
});

Template.Symbols_editor.events({
  'click .js-edit-symbol': function(event, instance){
    instance.editSymbol();
  },
  'click .js-delete-symbol': function(event, instance){
    instance.deleteSymbol();
  },
  'mousedown .js-cancel, click .js-cancel'(event, instance) {
    event.preventDefault();
    instance.state.set('editing', false);
  },
  'keydown input[type=text]'(event) {
  // ESC
    if (event.which === 27) {
      event.preventDefault();
      instance.$(event.target).blur();
    }
  },
  'blur input[type=text]'(event, instance) {
  // if we are still editing (we haven't just clicked the cancel button)
    if (instance.state.get('editing')) {
//      instance.saveSymbol();
    }
  },
  'submit .js-edit-form'(event, instance) {
    console.log( "SUBMIT" );
    console.log(event.type);
    event.preventDefault();
    instance.saveSymbol();
  },
});
