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

Template.editSymbol.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Symbols.update(this._id, {
      $set: {checked: ! this.checked}
    });
  },
  "click .delete": function () {
    Symbols.remove(this._id);
  },
  "click .add-pin": function () {
    Symbols.update(this._id, {
      $push: {pin: this.pin}
    });
  },
  "click .save": function () {
    Symbols.update(this._id, {
      $set: {title: this.title}
      //{$mod: {<field>: ...}}
    });
    Session.set("editSymbol", "");
  }
});
