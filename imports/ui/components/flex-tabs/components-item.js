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
      component: { type: Components._helpers },
      type: { type: String, optional: true },
      view_grid: { type: Boolean, optional: true },
      onViewChange: { type: Function },
    }).validate(Template.currentData());
  });
});

Template.Components_item.onRendered(function componentsItemOnRendered() {
});


Template.Components_item.helpers({
  hasTypes: function(component){
      return _.isArray(component.types) && component.types[0] !== ""
  },
  symbolsSVG: function(){
    return Session.get("symbolsSVG");
  },
  symbolName: function(component, type){
    if(type !== "" ){
      return "sym-"+ component.key +"-"+ type;
    }
    else if (_.isArray(component.types) && component.types[0] !== "") {
      return "sym-"+ component.key +"-"+ component.types[0];
    }
    else {
      return "sym-"+ component.key;
    }
  }
});

Template.Components_item.events({
  'click .js-select-component': function (event, instance) {
    const symbolName = this.type ? this.component.key+"-"+this.type : this.component.key;
    Session.set("component2add", {
      "name": this.component.name,
      "key": this.component.key,
      "type": this.type,
      "symbol": symbolName,
//      "pins": ""
    });
  },

  'click .js-show-more-types': function (event, instance) {
    const $parent = $( event.delegateTarget );
    const $types = $parent.find('.more-types');
//    $types.css( {'left': '-'+ $parent.position().left+'px', 'width': '400%'} );
    instance.$('.opened').removeClass('opened');
    $types.addClass('opened');
  },
});
