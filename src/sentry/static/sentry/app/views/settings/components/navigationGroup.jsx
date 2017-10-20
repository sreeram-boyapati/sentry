import PropTypes from 'prop-types';
import React from 'react';

import SettingsHeading from './settingsHeading';
import SettingsNavItem from './settingsNavItem';
import SettingsNavSection from './settingsNavSection';
import SentryTypes from '../../../proptypes';

export default class NavigationGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        /**
       * Function that is given an object with
       * `access`, `features`
       *
       * Return true to show nav item, false to hide
       */
        show: PropTypes.oneOfType(PropTypes.func, PropTypes.bool),

        /**
       * Function that is given an object with
       * `access`, `features`, `organization`
       *
       * Return number to show in badge
       */
        badge: PropTypes.func
      })
    ),
    organization: SentryTypes.Organization,
    access: PropTypes.object,
    features: PropTypes.object
  };

  static contextTypes = {
    location: PropTypes.object
  };

  render() {
    let {organization, name, items} = this.props;

    return (
      <SettingsNavSection>
        <SettingsHeading>{name}</SettingsHeading>
        {items.map(({path, title, show, badge}) => {
          if (typeof show === 'function' && !show(this.props)) return null;
          if (typeof show !== 'undefined' && !show) return null;
          let badgeResult = typeof badge === 'function' ? badge(this.props) : null;

          return (
            <SettingsNavItem
              key={title}
              to={path.replace(':orgId', organization.slug)}
              label={title}
              badge={badgeResult}
            />
          );
        })}
      </SettingsNavSection>
    );
  }
}
