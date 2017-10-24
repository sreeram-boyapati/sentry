import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import SettingsNavItem from './settingsNavItem';
import SentryTypes from '../../../proptypes';

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const SettingsHeading = styled.div`
  color: ${p => p.theme.gray3};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

export default class NavigationGroup extends React.Component {
  static propTypes = {
    ...SentryTypes.NavigationGroup,
    organization: SentryTypes.Organization,
    project: SentryTypes.Project,
    access: PropTypes.object,
    features: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  };

  render() {
    let {organization, name, items} = this.props;
    let {router} = this.context;

    return (
      <NavSection>
        <SettingsHeading>{name}</SettingsHeading>
        {items.map(({path, title, show, badge}) => {
          if (typeof show === 'function' && !show(this.props)) return null;
          if (typeof show !== 'undefined' && !show) return null;
          let badgeResult = typeof badge === 'function' ? badge(this.props) : null;
          let to = path.replace(':orgId', organization.slug);

          return (
            <SettingsNavItem
              active={router.isActive(to)}
              key={title}
              to={to}
              label={title}
              badge={badgeResult}
            />
          );
        })}
      </NavSection>
    );
  }
}
