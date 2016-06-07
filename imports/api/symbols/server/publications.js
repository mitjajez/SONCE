import { Meteor } from 'meteor/meteor';

import { Symbols } from '../symbols.js';

Meteor.publishComposite('symbols.all', {
  find: function() {
    return Symbols.find({}, {reactive: false});
  }
});

Meteor.publishComposite('symbol.selected', function symbolSelected(sid) {
  new SimpleSchema({
    sid: { type: String },
  }).validate({ sid });

  return{
    find: function() {
      return Symbols.find({}, {reactive: false});
    },
  }

});
