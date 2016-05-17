import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveDict } from 'meteor/reactive-dict';

import './active-wire.html';

Template.Active_wire.helpers({
  visibility() {
    return this.wiring ? "visible" : "hidden"
  }
});

Template.Active_wire.events({
});
