console.log( "elements.js" );
Template.listOfElements.helpers({
  elements: function () {
    return Elements.find({});
  }
});

Template.gridOfElements.helpers({
  elements: function () {
    console.log( "Elements: %o", Elements );
    return Elements.find({});
  },
  elArgs(el) {
    var symKeys = [el.key];
    if ( _.isArray(el.types) ) {
      _.each(el.types, function(type,i){
        if( _.isString(type) && type !== ""){
          symKeys[i] = el.key +"-"+ type;
        }
      })
    }

    var symTypes = [];
    Symbols
      .find( { 'symbol.key': {$in: symKeys} } )
      .forEach(function (s) { symTypes.push( s.symbol.svg ); });

    return { el, symTypes: symTypes};
  }
});

Template.elementIcon.events({
  "click .element, focus .element": function(event){
    event.preventDefault();
    const instance = Template.instance();
    var ie = instance.$('.element');
    const parent = ie.offsetParent();
    var off = ie.offset();
    var width = parent.width();
    var offParent = parent.offset();

    const subinstance = instance.$('.element + div');
    subinstance.addClass( "show" );
    subinstance.css( 'top', off.top - offParent.top );
    subinstance.width( width );

  },
  "click .toggle-types": function(event){
    event.preventDefault();
    const self = Template.instance().$('.toggle-types');
    self.removeClass( "show" );
  },
  "keypress": function(event) {
    console.log( event.keyCode );
    if (event.keyCode === 27) {   // esc
    }
  }

});
