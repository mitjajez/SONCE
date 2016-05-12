import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Elements } from '../elements.js';
import { Circuits } from '../../circuits/circuits.js';

Meteor.publishComposite('elements.inCircuit', function elementsInCircuit(cid) {
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
      // used to drive the child queries to get the elements
      const options = {
        fields: { _id: 1 },
      };

      return Circuits.find(query, options);
    },

    children: [{
      find(circuit) {
        return Elements.find({ cid: circuit._id }, { fields: Elements.publicFields });
      },
    }],
  };
});
