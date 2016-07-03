import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session'
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

import { TabBar } from 'meteor/flextab';

import { componentsListRenderHold } from '../../launch-screen.js';
import { Components } from '../../../api/components/components.js';

import { displayError } from '../../lib/errors.js';
//import '../search-components.js';
import './components-item.js';

import './components-list.html';

Template.Components_list.onCreated(function componentsListOnCreated() {
  this.autorun(() => {
    this.subscribe('components.inList');
  });

  this.state = new ReactiveDict();
  this.state.setDefault({
    view: 'grid'
  });

  this.setView = (view_grid) => {
    instance.state.set('view', view_grid ? 'grid' : false);
  }
});

Template.Components_list.helpers({
  inputAttributes: () => {
    return {
      class: 'form-control',
      name: 'filter',
    };
  },

  componentsIndex: () => Components.index,

  view_grid: () => Template.instance().state.equals('view', 'grid'),

  viewClass: () => Template.instance().state.get('view'),

  components: () => Components.find({}),
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


Template.Components_list.onRendered(function componentsListsOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      componentsListRenderHold.release();
    }
  });
});
