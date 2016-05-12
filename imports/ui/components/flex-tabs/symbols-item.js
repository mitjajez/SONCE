import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore';

import './symbols-item.html';
import { Symbols } from '../../../api/symbols/symbols.js';

Template.Symbols_item.onCreated(function symbolsItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      symbol: { type: Symbols._helpers },
    }).validate(Template.currentData());
  });
});

Template.Symbols_item.onRendered(function symbolsItemOnRendered() {
});


Template.Symbols_item.helpers({
  symbolsSVG: function(){
    return Session.get("symbolsSVG");
  },
});

Template.Symbols_item.events({
  'click .js-select-symbol': function (event, instance) {
    const data = instance.data;
  },

  'click .js-show-more': function (event, instance) {
    const $parent = $( event.delegateTarget );
    const $types = $parent.find('.more-types');
//    $types.css( {'left': '-'+ $parent.position().left+'px', 'width': '400%'} );
    instance.$('.opened').removeClass('opened');
    $types.addClass('opened');
  },
});
