import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { TabBar } from 'meteor/flextab';
import { TAPi18n } from 'meteor/tap:i18n';

import './flex-tab-bar.html';

Template.Flex_tab_bar.helpers({
  buttons: function() {
    return TabBar.getButtons();
  }
});
Template.Flex_tab_button.helpers({
  active: function(button) {
    if (button.template === TabBar.getTemplate() && TabBar.isFlexOpen()) {
      return 'active';
    }
  },
  title: function(button) {
    return TAPi18n.__(button.i18nTitle) || button.title;
  },
  visible: function(button) {
    if (button.groups.indexOf(TabBar.getVisibleGroup()) === -1) {
      return 'hidden';
    }
  }
});

Template.Flex_tab_bar.events({
  'click .tab-button': function(e, t) {
    const button = this.button;
    e.preventDefault();
    if (TabBar.isFlexOpen() && TabBar.getTemplate() === button.template) {
      TabBar.closeFlex();
      return $('.flex-tab').css('max-width', '');
    } else {
      if ((button.openClick == null) || button.openClick(e, t)) {
        if (button.width != null) {
          $('.flex-tab').css('max-width', button.width + "px");
        } else {
          $('.flex-tab').css('max-width', '');
        }
      }
      TabBar.setTemplate(button.template, function() {
          const ref = $('.flex-tab');
          if (ref != null) {
            const ref1 = ref.find("input[type='text']:first");
            if (ref1 != null) { ref1.focus(); }
          }
          const ref2 = $('.flex-tab .content');
          return ref2 != null ? ref2.scrollTop(0) : void 0;
        });

    }
  }
});

Template.Flex_tab_bar.onCreated(function() {
  this.autorun(() => {
    let visibleGroup = TabBar.getVisibleGroup();
    Tracker.nonreactive(function() {
      const openedTemplate = TabBar.getTemplate();
      let exists = false;
      TabBar.getButtons().forEach(function(button) {
        if (button.groups.indexOf(visibleGroup) !== -1
        && openedTemplate === button.template) {
          exists = true;
        }
      });
      if (!exists) {
        TabBar.closeFlex();
      }
    });
  });
});
