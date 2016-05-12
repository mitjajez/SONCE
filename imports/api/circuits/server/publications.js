import { Meteor } from 'meteor/meteor';

import { Circuits } from '../circuits.js';

Meteor.publish('circuits.public', function circuitsPublic() {
  return Circuits.find({
    userId: { $exists: false },
  }, {
    fields: Circuits.publicFields,
  });
});

Meteor.publish('circuits.private', function circuitsPrivate() {
  if (!this.userId) {
    return this.ready();
  }

  return Circuits.find({
    userId: this.userId,
  }, {
    fields: Circuits.publicFields,
  });
});
