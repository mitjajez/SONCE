Meteor.startup(function () {
  console.log( "Startup" );
  // code to run on server at startup
  var reset = 1;
  if(reset){
    Elements.remove({});
    Symbols.remove({});
  }
//  var els = JSON.parse( Assets.getText("library/library.json" ) ).elements;
//  if( Elements.find().count() !== _.size(els) ){
  if( Elements.find().count() === 0 ){
    var els = JSON.parse( Assets.getText("library/library.json" ) ).elements;
    _.each( els, function(e, key){
      Elements.insert( {element:e} );
    });
  }
//  var syms = JSON.parse( Assets.getText("library/symbols.json" ) ).symbols;
//  if( Symbols.find().count() !== _.size(syms) ){
  if( Symbols.find().count() === 0 ){
    var syms = JSON.parse( Assets.getText("library/symbols.json" ) ).symbols;
    _.each( syms, function(s, key){
      Symbols.insert( {symbol:s} );
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
