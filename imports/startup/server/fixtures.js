import { Meteor }         from 'meteor/meteor';
import { SymbolsLib }     from 'meteor/sonce:library';
import { ComponentsLib }  from 'meteor/sonce:library';
import { Symbols }        from '../../api/symbols/symbols.js';
import { Components }     from '../../api/components/components.js';
import { Circuits }       from '../../api/circuits/circuits.js';
import { Elements }       from '../../api/elements/elements.js';
import { Wires }          from '../../api/wires/wires.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  const reset = 0;
  if(reset){
    Components.remove({});
    Symbols.remove({});
  }

  if( Symbols.find().count() === 0 ){
    const symbols = JSON.parse( SymbolsLib );
    _.each( symbols, function(s, key){
      Symbols.insert( s );
    });
  }

  if( Components.find().count() === 0 ){
    const components = JSON.parse( ComponentsLib );
    _.each( components, function(c, key){
      Components.insert( c );
    });
  }

  if( Circuits.find().count() === 0 ){
    /*
    const data = [
      {
        name: 'Meteor Principles',
        items: [ 'Data on the Wire', 'One Language', 'Database Everywhere',
          'Latency Compensation', 'Full Stack Reactivity',
          'Embrace the Ecosystem', 'Simplicity Equals Productivity',
        ],
      },
      {
        name: 'Languages',
        items: [ 'Lisp', 'C', 'C++', 'Python', 'Ruby', 'JavaScript', 'Scala',
          'Erlang', '6502 Assembly',
        ],
      },
      {
        name: 'Favorite Scientists',
        items: [ 'Ada Lovelace', 'Grace Hopper', 'Marie Curie',
          'Carl Friedrich Gauss', 'Nikola Tesla', 'Claude Shannon',
        ],
      },
    ];

    let timestamp = (new Date()).getTime();

    data.forEach((circuit) => {
      const cid = Circuits.insert({
        name: circuit.name,
        incompleteCount: circuit.items.length,
      });

      circuit.items.forEach((text) => {
        Elements.insert({
          cid,
          text,
          createdAt: new Date(timestamp),
        });

        timestamp += 1; // ensure unique timestamp.
      });
    });
    */
  }

  if( Elements.find().count() === 0 ){
  }

});
