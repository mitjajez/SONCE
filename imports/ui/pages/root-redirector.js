import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Circuits } from '../../api/circuits/circuits.js';

import './root-redirector.html';

Template.App_rootRedirector.onCreated(() => {
  // We need to set a timeout here so that we don't redirect from inside a redirection
  //   which is a limitation of the current version of FR.
  Meteor.defer(() => {
    FlowRouter.go('Circuits.show', Circuits.findOne());
  });
});
