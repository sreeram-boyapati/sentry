import {Box, Flex} from 'grid-emotion';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import SettingsActivity from './components/settingsActivity';
import SettingsBreadcrumb from './components/settingsBreadcrumb';
import SettingsHeader from './components/settingsHeader';

let StyledWarning = styled.div`
  margin-bottom: 30px;
`;

// TODO(billy): Temp
let NewSettingsWarning = ({location = {}}) => {
  // TODO(billy): Remove this warning when ready
  let oldLocation = location.pathname
    ? location.pathname.replace(/^\/settings\/organization\//, '/organizations/')
    : '';
  // members or auth should not be react routes
  let isRouter = !/\/(members|auth)\//.test(location.pathname);

  let linkProps = {
    href: isRouter ? undefined : oldLocation,
    to: isRouter ? oldLocation : undefined,
  };
  let Component = isRouter ? Link : 'a';

  return (
    <StyledWarning className="alert alert-warning">
      These settings are currently in beta. Please report any issues. You can temporarily
      visit the <Component {...linkProps}>old settings page</Component> if necessary.
    </StyledWarning>
  );
};

const Content = styled(Box)`
  flex: 1;
`;

class SettingsLayout extends React.Component {
  static propTypes = {
    renderNavigation: PropTypes.func,
  };

  render() {
    let {params, renderNavigation, children} = this.props;
    // We want child's view's props
    let childProps = (children && children.props) || this.props;
    let childRoutes = childProps.routes || [];
    let childRoute = childProps.route || {};

    return (
      <div>
        <SettingsHeader>
          <Box flex="1">
            <SettingsBreadcrumb params={params} routes={childRoutes} route={childRoute} />
          </Box>
          <SettingsActivity />
        </SettingsHeader>

        <Flex>
          <Box flex="0 0 210px">
            <StickySidebar>
              {typeof renderNavigation === 'function' && renderNavigation()}
            </StickySidebar>
          </Box>

          <Content>
            <NewSettingsWarning location={this.props.location} />

            {children}
          </Content>
        </Flex>
      </div>
    );
  }
}

const StickySidebar = styled.div`
  position: sticky;
  top: 105px;
`;

export default SettingsLayout;
