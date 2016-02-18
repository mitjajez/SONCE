Template.symbol.helpers({
  editMode: function() {
    return Session.equals("editSymbol", this._id) ?
      true : false;
  }
});

Template.symbol.events({
  "click .edit": function (event) {
    Session.equals("editSymbol", this._id) ?
      Session.set("editSymbol", ""):
      Session.set("editSymbol", this._id);
  }
});
