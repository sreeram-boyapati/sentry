import PropTypes from 'prop-types';
import React from 'react';

import {
  addErrorMessage,
  addSuccessMessage,
} from '../../../actionCreators/settingsIndicator';
import {t} from '../../../locale';
import AsyncView from '../../asyncView';
import Form from '../../../components/forms/next/form';
import TeamModel from './model';
import TextField from '../../../components/forms/next/textField';

export default class TeamSettings extends AsyncView {
  static propTypes = {
    ...AsyncView.propTypes,
    team: PropTypes.object.isRequired,
    onTeamChange: PropTypes.func.isRequired,
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
    let team = this.props.team;

    return (
      <div className="box">
        <div className="box-content with-padding">
          <Form
            model={this.model}
            saveOnBlur
            allowUndo
            onSubmitSuccess={() => addSuccessMessage('Change saved', 3000)}
            onSubmitError={() => addErrorMessage('Unable to save change', 3000)}
            initialData={{
              name: team.name,
              slug: team.slug,
            }}
          >
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
