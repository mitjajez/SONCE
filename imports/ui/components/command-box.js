import './command-box.html';

import { Hotkeys } from 'meteor/flowkey:hotkeys';

import { displayError } from '../lib/errors.js';

import {
  removeWire,
} from '../../api/wires/methods.js';

Template.Command_box.helpers({
});

Template.Command_box.events({
  'click .command_box' (event, instance) {
    event.preventDefault();
    console.log( 'click .command_box');

    const $cli = instance.$('input[name=command-line]');
    $cli.focus();
  },

});
