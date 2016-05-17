import { Template } from 'meteor/peerlibrary:blaze-components';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'

import './active-element.html';

Template.Active_element.onCreated(function activeElementOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    visibility: "hidden",  // element center | click coords
  });

  this.show = () => {
    this.state.set('visibility', "visible");
  };

  this.hide = () => {
    this.state.set('visibility', "hidden");
  };

});


Template.Active_element.helpers({
  visibility() {
    const instance = Template.instance();
    return instance.state.get('visibility');
  },
});

Template.Active_element.events({
});
