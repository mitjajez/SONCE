Template.listOfElements.helpers({
  elements: function () {
    return Elements.find({});
  }
});

Template.gridOfElements.helpers({
  elements: function () {
    return Elements.find({});
  },
  elArgs: function(el) {
    var symKey = el.key;
    if ( _.isArray(el.types) ) {
      symKey = el.key +"-"+ el.types[0];
    }
    var symType = Symbols.findOne({"symbol.key": symKey});
    return {
      el,
      elTypes: _.isArray(el.types) ? "" : "addElement",
      elTypes: _.isArray(el.types) ? el.types : 0,
      symType: _.isObject(symType) ? symType.symbol.svg : ""
    };
  }
});

Template.elementIcon.helpers({
  symArgs: function( el, elType ) {
    var symKey = this.el.key +"-"+ elType;
    var symType = Symbols.findOne({"symbol.key": symKey});
    return {
      el,
      elType,
      symType: _.isObject(symType) ? symType.symbol.svg : ""
    }
  }
});

Template.elementIcon.events({
  "click .element, focus .element": function(event, instance){
    event.preventDefault();
    var ie = instance.$('.element');
    if (this.elTypes){
      const parent = ie.offsetParent();
      var off = ie.offset();
      var width = parent.width();
      var offParent = parent.offset();

      const subinstance = instance.$('.element + div.toggle-types');
      subinstance.addClass( "show" );
      subinstance.css( 'top', off.top - offParent.top );
      subinstance.width( width );
    }
  },
  "click .toggle-types": function(event){
    event.preventDefault();
    const self = Template.instance().$('.toggle-types');
    self.removeClass( "show" );
  }
});
