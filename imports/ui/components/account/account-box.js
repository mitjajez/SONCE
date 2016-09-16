import './account-box.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

Template.Account_box.onCreated (function AccountBoxOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    userMenuOpen: false,
  });
});

Template.Account_box.onRendered (function AccountBoxOnRendered() {
});

Template.Account_box.helpers ({
  userMenuOpen() {
    const instance = Template.instance();
    return instance.state.get('userMenuOpen');
  },

  emailLocalPart() {
    const email = Meteor.user().emails[0].address;
    return email.substring(0, email.indexOf('@'));
  },

});

Template.Account_box.events ({
  'click .js-user-menu'(event, instance) {
    instance.state.set('userMenuOpen', !instance.state.get('userMenuOpen'));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click .js-logout'() {
    Meteor.logout();

    // if we are on a private circuit, we'll need to go to a public one
    if (ActiveRoute.name('Circuits.show')) {
      // TODO -- test this code path
      const circuit = Circuits.findOne(FlowRouter.getParam('_id'));
      if (circuit.owner) {
        FlowRouter.go('Circuits.show', Circuits.findOne({ owner: { $exists: false } }));
      }
    }
  },

});
