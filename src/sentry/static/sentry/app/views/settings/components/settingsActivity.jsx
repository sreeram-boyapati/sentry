import {Box} from 'grid-emotion';
import {withTheme} from 'emotion-theming';
import React from 'react';
import Reflux from 'reflux';
import styled from 'react-emotion';

import SettingsIndicatorStore from '../../../stores/settingsIndicatorStore';

const Container = withTheme(
  styled(Box)`
    font-size: 14px;
    color: ${p => p.theme.gray2};
  `
);

const SettingsActivity = React.createClass({
  mixins: [Reflux.connect(SettingsIndicatorStore, 'activity')],

  getInitialState() {
    return {
      activity: null,
    };
  },

  render() {
    let {activity} = this.state;

    if (!activity) {
      return null;
    }

    return <Container type={activity.type}>{activity.message}</Container>;
  },
});

export default SettingsActivity;
