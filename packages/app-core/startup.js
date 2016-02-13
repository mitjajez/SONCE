Meteor.startup(function () {
  // code to run on server at startup
  var reset = 0;
  if(reset){
    Elements.remove({});
    Symbols.remove({});

  }
//  var els = JSON.parse( Assets.getText("library/library.json" ) ).elements;
//  if( Elements.find().count() !== _.size(els) ){
  if( Elements.find().count() === 0 ){
    var els = JSON.parse( Assets.getText("library/library.json" ) ).elements;
    _.each( els, function(element, key){
      Elements.insert( {element} );
    });
  }
//  var syms = JSON.parse( Assets.getText("library/symbols.json" ) ).symbols;
//  if( Symbols.find().count() !== _.size(syms) ){
  if( Symbols.find().count() === 0 ){
    var syms = JSON.parse( Assets.getText("library/symbols.json" ) ).symbols;
    _.each( syms, function(symbol, key){
      Symbols.insert( {symbol} );
    });
  }
  // On the server
//
//      library: function (comment, postId) {
//      "getLibrary": function () {
//        return JSON.parse( Assets.getText("library/library.json") );
//      },

//      "getSymbols": function () {
//        return JSON.parse( Assets.getText("library/symbols.json") );
//      }
//    });


});
