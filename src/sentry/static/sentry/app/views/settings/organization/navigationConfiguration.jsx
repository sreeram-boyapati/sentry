const organizationNavgiation = [
  {
    name: 'Organization',
    items: [
      {
        path: '/settings/organization/:orgId/projects/',
        title: 'Projects'
      },
      {
        path: '/settings/organization/:orgId/settings/',
        title: 'General Settings',
        show: ({access}) => access.has('org:write')
      },
      {
        path: '/settings/organization/:orgId/members/',
        title: 'Members',
        // eslint-disable-next-line no-shadow
        badge: ({organization, access, features}) => {
          if (!access.has('org:write')) return null;
          if (organization.pendingAccessRequests <= 0) return null;

          return organization.pendingAccessRequests;
        },
        show: ({access}) => access.has('org:read')
      },
      {
        path: '/settings/organization/:orgId/auth/',
        title: 'Auth',
        show: ({access, features}) => features.has('sso') && access.has('org:admin')
      },
      {
        path: '/settings/organization/:orgId/api-keys/',
        title: 'API Keys',
        show: ({access, features}) => features.has('api-keys') && access.has('org:admin')
      },
      {
        path: '/settings/organization/:orgId/audit-log/',
        title: 'Audit Log',
        show: ({access}) => access.has('org:write')
      },
      {
        path: '/settings/organization/:orgId/rate-limits/',
        title: 'Rate Limits',
        show: ({access}) => access.has('org:write')
      },
      {
        path: '/settings/organization/:orgId/repos/',
        title: 'Repositories',
        show: ({access}) => access.has('org:write')
      },
      {
        path: '/settings/organization/:orgId/integrations/',
        title: 'Integrations',
        show: ({access, features}) =>
          features.has('integrations-v3') && access.has('org:integrations')
      }
    ]
  }
];

export default organizationNavgiation;
