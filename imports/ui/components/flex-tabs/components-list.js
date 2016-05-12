//import { Template } from 'meteor/templating';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session'

import { TabBar } from 'meteor/flextab';

import { componentsListRenderHold } from '../../launch-screen.js';
import './components-list.html';
import './components-item.js';

import { Components } from '../../../api/components/components.js';

//import {
//  insertElement,
//} from '../../../api/elements/methods.js';

import { displayError } from '../../lib/errors.js';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

Template.Components_list.helpers({
  components: function() {
    return Components.find({});
  },
  componentArgs: function(component, type){
//    console.log( "Components_list.helpers.component" );
//    console.log( component );
    const instance = Template.instance();
    return {
      component,
      type,
      view_grid: instance.state.equals('view', 'grid'),
      onViewChange(view_grid) {
        instance.state.set('view', view_grid ? 'grid' : false);
      }
    };
  }
});

Template.Components_list.events({
  'click .more-types': function (event, instance) {
    instance.$('.opened').removeClass('opened');
  },

  'click .js-cancel'(event, instance) {
    instance.state.set('view_grid', false);
  },

  'keydown input[type=text]'(event) {
  // ESC
    if (event.which === 27) {
      event.preventDefault();
      $(event.target).blur();
    }
  },
  /*
  "keydown #message-search": function(e) {
    if (e.keyCode === 13) {
      return e.preventDefault();
    }
  },
  "keyup #message-search": _.debounce(function(e, t) {
    var value;
    value = e.target.value.trim();
    if (value === '' && t.currentSearchTerm.get()) {
      t.currentSearchTerm.set('');
      t.searchResult.set(void 0);
      t.hasMore.set(false);
      return;
    } else if (value === t.currentSearchTerm.get()) {
      return;
    }
    t.hasMore.set(true);
    t.limit.set(20);
    return t.search();
  }, 500),
  'click .element-cog': function(e, t) {
    var actions, dropDown, el, message, message_id, ref;
    e.stopPropagation();
    e.preventDefault();
    message_id = $(e.currentTarget).closest('.element').attr('id');
    $('.element-dropdown:visible').hide();
    $(".search-messages-list \#" + message_id + " .element-dropdown").remove();
    message = _.findWhere((ref = t.searchResult.get()) != null ? ref.elements : void 0, function(message) {
      return message._id === message_id;
    });
    actions = ElementAction.getButtons(message);
    el = Blaze.toHTMLWithData(Template.elementDropdown, {
      actions: actions
    });
    $(".search-messages-list \#" + message_id + " .element-cog-container").append(el);
    dropDown = $(".search-messages-list \#" + message_id + " .element-dropdown");
    return dropDown.show();
  },
  'click .load-more a': function(e, t) {
    t.limit.set(t.limit.get() + 20);
    return t.search();
  },
  'scroll .content': _.throttle(function(e, t) {
    if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight) {
      t.limit.set(t.limit.get() + 20);
      return t.search();
    }
  }, 200)
  */
});

Template.Components_list.onCreated(function componentsListOnCreated() {
  this.autorun(() => {
    this.subscribe('components.inList');
  });

  this.state = new ReactiveDict();
  this.state.setDefault({
    view: 'grid'
  });

  /*
  this.currentSearchTerm = new ReactiveVar('');
  this.searchResult = new ReactiveVar;
  this.hasMore = new ReactiveVar(true);
  this.limit = new ReactiveVar(20);
  this.ready = new ReactiveVar(true);
  return this.search = (function(_this) {
    return function() {
      var value;
      _this.ready.set(false);
      value = _this.$('#message-search').val();
      return Tracker.nonreactive(function() {
        return Meteor.call('messageSearch', value, Session.get('openedRoom'), _this.limit.get(), function(error, result) {
          var ref, ref1, ref2, ref3, ref4, ref5;
          _this.currentSearchTerm.set(value);
          _this.ready.set(true);
          if ((result != null) && (((ref = result.elements) != null ? ref.length : void 0) > 0 || ((ref1 = result.users) != null ? ref1.length : void 0) > 0 || ((ref2 = result.channels) != null ? ref2.length : void 0) > 0)) {
            _this.searchResult.set(result);
            if (((ref3 = result.elements) != null ? ref3.length : void 0) + ((ref4 = result.users) != null ? ref4.length : void 0) + ((ref5 = result.channels) != null ? ref5.length : void 0) < _this.limit.get()) {
              return _this.hasMore.set(false);
            }
          } else {
            return _this.searchResult.set();
          }
        });
      });
    };
  })(this);
  */
});
Template.Components_list.onRendered(function componentsListsOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      componentsListRenderHold.release();
    }
  });
});
