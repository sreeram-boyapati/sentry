import TeamActions from '../actions/teamActions';

// Fetch teams for org
export function fetchTeams(api, params) {
  TeamActions.fetchAll(params.orgId);
  return api.requestPromise(`/teams/${params.orgId}/`, {
    success: data => {
      TeamActions.fetchAllSuccess(params.orgId, data);
    },
    error: error => {
      TeamActions.fetchAllError(params.orgId, error);
    },
  });
}

export function fetchTeamDetails(api, params) {
  TeamActions.fetchDetails(params.teamId);
  return api.requestPromise(`/teams/${params.orgId}/${params.teamId}/`, {
    success: data => {
      TeamActions.fetchDetailsSuccess(params.teamId, data);
    },
    error: error => {
      TeamActions.fetchDetailsError(params.teamId, error);
    },
  });
}

export function updateTeam(api, params) {
  let id = api.uniqueId();
  let endpoint = `/teams/${params.orgId}/${params.teamId}/`;
  TeamActions.update(id, params.teamId, params.data);

  return api.requestPromise(endpoint, {
    method: 'PUT',
    data: params.data,
    success: data => {
      TeamActions.updateSuccess(id, params.teamId, data);
    },
    error: data => {
      TeamActions.updateError(id, params.teamId, data);
    },
  });
}

export function joinTeam(api, params) {
  let endpoint = `/organizations/${params.orgId}/members/${params.memberId ||
    'me'}/teams/${params.teamId}/`;
  let id = api.uniqueId();

  TeamActions.update(id, params.teamId);

  return api.requestPromise(endpoint, {
    method: 'POST',
    data: params.data,
    success: data => {
      TeamActions.updateSuccess(id, params.teamId, data);
    },
    error: data => {
      TeamActions.updateError(id, params.teamId, data);
    },
  });
}

export function leaveTeam(api, params) {
  let endpoint = `/organizations/${params.orgId}/members/${params.memberId ||
    'me'}/teams/${params.teamId}/`;
  let id = api.uniqueId();

  TeamActions.update(id, params.teamId);

  return api.requestPromise(endpoint, {
    method: 'DELETE',
    success: data => {
      TeamActions.updateSuccess(id, params.teamId, data);
    },
    error: data => {
      TeamActions.updateError(id, params.teamId, data);
    },
  });
}
