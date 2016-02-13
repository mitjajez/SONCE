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
