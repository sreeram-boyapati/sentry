import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import HookStore from '../../../stores/hookStore';
import NavigationGroup from '../components/navigationGroup';
import OrganizationState from '../../../mixins/organizationState';
import navigationConfiguration from './navigationConfiguration';
import SentryTypes from '../../../proptypes';

class OrganizationSettingsNavigation extends React.Component {
  static propTypes = {
    organization: SentryTypes.Organization,
    access: PropTypes.object,
    features: PropTypes.object,
    hooks: PropTypes.array.isRequired
  };

  render() {
    let {organization, access, features, hooks} = this.props;
    let navWithHooks = navigationConfiguration.concat(hooks);

    return (
      <Box>
        {navWithHooks.map(config => (
          <NavigationGroup
            key={config.title}
            {...config}
            access={access}
            features={features}
            organization={organization}
          />
        ))}
      </Box>
    );
  }
}

const OrganizationSettingsNavigationContainer = React.createClass({
  contextTypes: {
    location: PropTypes.object
  },

  mixins: [OrganizationState],

  getInitialState() {
    // Allow injection via getsentry et all
    let org = this.getOrganization();
    let hooks = [];
    HookStore.get('organization:settings-sidebar').forEach(cb => {
      hooks.push(cb(org));
    });

    return {
      hooks
    };
  },

  render() {
    let access = this.getAccess();
    let features = this.getFeatures();
    let org = this.getOrganization();

    return (
      <OrganizationSettingsNavigation
        access={access}
        features={features}
        organization={org}
        hooks={this.state.hooks}
      />
    );
  }
});

export {OrganizationSettingsNavigation};
export default OrganizationSettingsNavigationContainer;
