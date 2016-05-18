import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import './components-item.html';
import { Components } from '../../../api/components/components.js';
import { Symbols } from '../../../api/symbols/symbols.js';

Template.Components_item.onCreated(function componentsItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      key: { type: String },
      name: { type: String },
      type: { type: String, optional: true },
    }).validate(Template.currentData());
  });
});

Template.Components_item.onRendered(function componentsItemOnRendered() {
});


Template.Components_item.helpers({
  symbolsSVG: () => Session.get("symbolsSVG"),

  symbolName() {
    const sel = this.type ? this.key+"-"+this.type : this.key;
    const sym = Symbols.findOne({key:sel});
    return sym ? "sym-"+sym.svg : "";
  },

});

Template.Components_item.events({
  'click .js-select-component'(event, instance) {
    const sel = this.type ? this.key+"-"+this.type : this.key;
    const sym = Symbols.findOne({key:sel});

    Session.set("component2add", {
      "name": this.name,
      "key": this.key,
      "type": this.type,
      "symbol": sym ? sym.svg : "missing! Edit symbols.json",
//      "pins": ""
    });
  },

  'click .js-show-more-types'(event, instance) {
    const $parent = $( event.delegateTarget );
    const $types = $parent.find('.more-types');
//    $types.css( {'left': '-'+ $parent.position().left+'px', 'width': '400%'} );
    instance.$('.opened').removeClass('opened');
    $types.addClass('opened');
  },
});
