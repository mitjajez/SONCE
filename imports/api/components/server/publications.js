import { Meteor } from 'meteor/meteor';

import { Components } from '../components.js';

Meteor.publishComposite('components.inList', {
  find: function() {
    return Components.find({});
  }
});
