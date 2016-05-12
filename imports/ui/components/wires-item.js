import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/peerlibrary:blaze-components';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import './wires-item.html';
import { Wires } from '../../api/wires/wires.js';

Template.Wires_item.onCreated(function wiresItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      wire: { type: Wires._helpers },
      wiring: { type: Boolean, optional: true },
      selected: { type: Boolean, optional: true },
      setSelected: { type: Function },
    }).validate(Template.currentData());
  });
});

Template.Wires_item.events({
});
