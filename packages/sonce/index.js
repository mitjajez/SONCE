Template.body.events({
  "keypress": function(event) {
    console.log( event.keyCode );
    if (event.keyCode === 27) {   // esc
      console.log( " -Escape" );
    }
  }
});

Template.elementIcon.events({
  "click .addElement": function(event, instance){
    event.preventDefault();
    var self = this;
    console.log( "self: %o", self);
    console.log( "event: %o", event);
    $(event.currentTarget).addClass("selected");
//    console.log( "target: %o", event.currentTarget);
    selectedElement.set({element: self.el.key, type: self.elType, symbol: self.symType, position: ''});
  //  Circuit.insert({element: self.el.key, type: 'elType', symbol: 'symType', position: ''});
  }
});

Template.svgCanvas.helpers({
  circuitElements: function(){
    return Circuit.find();
  }
});

Template.svgCanvas.events({
  "click .svg-canvas": function(event, template){
    event.preventDefault();
    var self = this;
    console.log( "event: %o", event);
    console.log( "event: clientX="+ event.clientX +" clientY="+ event.clientY);
    console.log( "event: pageX="+ event.pageX +" pageY="+ event.pageY);
    console.log( "target: %o", event.currentTarget);
    console.log( $(event.currentTarget).offset() );
    var se = selectedElement.get();
    console.log( "se: %o", se);
    var canvasOffset = $(event.currentTarget).offset();

    var s = Snap(event.currentTarget);
//    var bigCircle = s.circle(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top, 20);
//    bigCircle.attr({ fill: "#bada55",stroke: "#fff", strokeWidth: 5 });

    var cir = s.use();
    cir.attr({
      'xlink:href': "library/symbols.svg#"+se.symbol,
      x: event.pageX - canvasOffset.left,
      y: event.pageY - canvasOffset.top
    });
    s.append(cir);

//    Circuit.insert(se);
  }
});
