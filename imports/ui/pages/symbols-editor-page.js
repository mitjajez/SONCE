import { Template } from 'meteor/peerlibrary:blaze-components';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Symbols } from '../../api/symbols/symbols.js';

import { symbolRenderHold } from '../launch-screen.js';
import './symbols-editor-page.html';

// Components used inside the template
import './app-not-found.js';
import '../components/symbols-editor/symbols-editor.js';

Template.Symbols_editor_page.onCreated(function symbolsEditorPageOnCreated() {
  this.getSymbolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('symbol.selected', this.getSymbolId());
  });
});

Template.Symbols_editor_page.onRendered(function symbolsEditorPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      symbolRenderHold.release();
    }
  });
});

Template.Symbols_editor_page.helpers({
  sidArray() {
    const instance = Template.instance();
    const sid = instance.getSymbolId();
    return Symbols.findOne(sid) ? [sid] : [];
  },
  symbolArgs(sid) {
    const instance = Template.instance();
    const symbol = Symbols.findOne(sid);
    return {
      symbolReady: instance.subscriptionsReady(),
      symbol() {
        return Symbols.findOne(sid)
      },
//      symbol,
    };
  },
});
