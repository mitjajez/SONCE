import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Wires } from '../wires.js';
import { Circuits } from '../../circuits/circuits.js';

Meteor.publishComposite('wires.inCircuit', function wiresInCircuit(cid) {
  new SimpleSchema({
    cid: { type: String },
  }).validate({ cid });

  const userId = this.userId;

  return {
    find() {
      const query = {
        _id: cid,
        $or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the wires
      const options = {
        fields: { _id: 1 },
      };

      return Circuits.find(query, options);
    },

    children: [{
      find(circuit) {
        return Wires.find({ cid: circuit._id });
      },
    }],
  };
});
