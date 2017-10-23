import PropTypes from 'prop-types';
import React from 'react';

import AsyncView from '../../asyncView';
import {t} from '../../../locale';
import TextField from '../../../components/forms/next/textField';
import Form from '../../../components/forms/next/form';
import TeamModel from './model';

export default class TeamSettings extends AsyncView {
  static propTypes = {
    ...AsyncView.propTypes,
    team: PropTypes.object.isRequired,
    onTeamChange: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.model = new TeamModel();
    this.model.teamId = props.params.teamId;
    this.model.orgId = props.params.orgId;
  }

  getTitle() {
    return 'Team Settings';
  }

  renderBody() {
    let {orgId, teamId} = this.props.params;
    let team = this.props.team;

    return (
      <div className="box">
        <div className="box-content with-padding">
          <Form
            model={this.model}
            apiMethod="PUT"
            apiEndpoint={`/teams/${orgId}/${teamId}/`}
            initialData={{
              name: team.name,
              slug: team.slug
            }}
            saveOnBlur
            allowUndo>
            <TextField
              name="name"
              label={t('Name')}
              placeholder={t('e.g. API Team')}
              help={t('The name of your team. e.g. API Team')}
              required={true}
            />
            <TextField
              name="slug"
              label={t('Short name')}
              placeholder={t('e.g. api-team')}
              help={t('A unique ID used to identify the team, e.g. api-team')}
              required={true}
            />
          </Form>
        </div>
      </div>
    );
  }
}
