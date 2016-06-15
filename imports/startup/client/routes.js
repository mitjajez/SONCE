import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { TabBar } from 'meteor/flextab';

// Import to load these templates
import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/circuits-show-page.js';
import '../../ui/pages/symbols-editor-page.js';
import '../../ui/pages/app-not-found.js';

// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_rootRedirector' });
  },
});

FlowRouter.route('/circuits/:_id', {
  name: 'Circuits.show',
  action() {
    TabBar.showGroup('circuit');
    BlazeLayout.render('App_body', { main: 'Circuits_show_page' });
  },
});

FlowRouter.route('/symbols/:_id', {
  name: 'Symbols.editor',
  action() {
    TabBar.showGroup('symbols');
    BlazeLayout.render('App_body', { main: 'Symbols_editor_page' });
  },
});

// the App_notFound template is used for unknown routes and missing circuits
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password',
});
