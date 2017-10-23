import PropTypes from 'prop-types';
import React from 'react';

import LazyLoad from '../components/lazyLoad';
import getSettingsComponent from '../utils/getSettingsComponent';

class TeamSettings extends React.Component {
  static propTypes = {
    routes: PropTypes.array,
  };

  render() {
    return (
      <LazyLoad
        component={() =>
          getSettingsComponent(
            () => import('./settings/team/teamSettings'),
            () => import('./settings/team/teamSettings.old'),
            this.props.routes
          )}
        {...this.props}
      />
    );
  }
}

export default TeamSettings;
