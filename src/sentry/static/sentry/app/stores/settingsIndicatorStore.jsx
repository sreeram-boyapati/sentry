import Reflux from 'reflux';

import SettingsIndicatorActions from '../actions/settingsIndicatorActions';

const SettingsIndicatorStore = Reflux.createStore({
  init() {
    this.state = null;
    this.listenTo(SettingsIndicatorActions.add, this.add);
    this.listenTo(SettingsIndicatorActions.remove, this.remove);
  },

  add(message, type, options = {}) {
    this.state = {
      message,
      type,
    };
    this.trigger(this.state);
  },

  remove() {
    // Do nothing if already null
    if (!this.state) return;

    this.state = null;
    this.trigger(this.state);
  },
});

export default SettingsIndicatorStore;
