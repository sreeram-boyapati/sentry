import {Box, Flex} from 'grid-emotion';
import {Observer, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, {keyframes} from 'react-emotion';
import Spinner from './styled/spinner';

import IconCheckmarkSm from '../../../icons/icon-checkmark-sm';
import IconWarningSm from '../../../icons/icon-warning-sm';

import FormState from '../state';

const SettingsPanelItemWrapper = styled(Flex)`
    padding: 15px 20px;
    border-bottom: 1px solid ${p => p.theme.borderLight};
    align-items: center;
    transition: background .15s;

    &:last-child {
      border-bottom: none;
    }
  `;

const SettingsPanelItemLabel = styled.div`
  color: ${p => p.theme.gray5};
`;

const SettingsPanelItemCtrl = styled(Box)`
  color: ${p => p.theme.gray3};
  width: 50%;
  padding-left: 10px;
  position: relative;
`;

const SettingsPanelItemCtrlState = styled(Box)`
  width: 36px;
  text-align: right;
`;

const SettingsPanelItemDesc = styled(Box)`
  width: 50%;
  padding-right: 10px;
`;

const SettingsRequiredBadge = styled.div`
  display: inline-block;
  background: ${p => p.theme.gray2};
  width: 5px;
  height: 5px;
  border-radius: 5px;
  text-indent: -9999em;
  vertical-align: super;
`;

const SettingsPanelItemHelp = styled.div`
  color: ${p => p.theme.gray2};
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.4;
`;

const SettingsErrorReason = styled.div`
  color: ${p => p.theme.redDark};
  position: absolute;
  background: #fff;
  left: 10px;
  padding: 6px 8px;
  font-weight: 600;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(64,11,54,0.15), 0 4px 20px 0 rgba(64,11,54,0.36);
  z-index: 10000;
`;
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1,1);
  }
  50% {
    transform: scale(1.15, 1.15);
  }
  100% {
    transform: scale(1, 1);
  }
`;

const SettingsError = styled.div`
  color: ${p => p.theme.redDark};
  animation: ${pulse} 1s ease infinite;
  width: 16px;
  margin-left: auto;
`;

const SettingsIsSaved = styled.div`
  color: ${p => p.theme.green};
  animation: ${fadeOut} .3s ease 2s 1 forwards;
`;

@observer class FormField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    /** Inline style */
    style: PropTypes.object,

    label: PropTypes.string,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    disabledReason: PropTypes.string,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    required: PropTypes.bool,
    hideErrorMessage: PropTypes.bool,

    // the following should only be used without form context
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.any
  };

  static defaultProps = {
    hideErrorMessage: false,
    disabled: false,
    required: false
  };

  static contextTypes = {
    saveOnBlur: PropTypes.bool,
    form: PropTypes.object
  };

  componentDidMount() {
    // Tell model this field is required
    // TODO?: add more validation types
    // this.attachTooltips();
    this.context.form.setRequired(this.props.name, this.props.required);
  }

  componentWillUnmount() {
    //this.removeTooltips();
    jQuery(ReactDOM.findDOMNode(this)).unbind();
  }

  attachTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip();
  }

  removeTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip('destroy');
  }

  getError(props, context) {
    return this.context.form.getError(this.props.name);
  }

  getId() {
    return `id-${this.props.name}`;
  }

  handleChange = value => {
    this.context.form.setValue(this.props.name, value);
    this.props.onChange && this.props.onChange(value);
  };

  handleBlur = value => {
    if (!this.context.saveOnBlur) return;

    this.context.form.saveField(this.props.name, value);
  };

  render() {
    let {required, label, disabled, disabledReason, hideErrorMessage, help} = this.props;
    let error = this.getError();
    let shouldShowErrorMessage = error && !hideErrorMessage;
    let id = this.getId();
    let model = this.context.form;

    let isSaving = model.getFieldState(this.props.name) === FormState.SAVING;
    let isSaved = model.getFieldState(this.props.name) === FormState.READY;

    return (
      <SettingsPanelItemWrapper>
        <SettingsPanelItemDesc>
          {label &&
            <SettingsPanelItemLabel>
              {label} {required && <SettingsRequiredBadge />}
            </SettingsPanelItemLabel>}
          {help && <SettingsPanelItemHelp>{help}</SettingsPanelItemHelp>}
        </SettingsPanelItemDesc>
        <SettingsPanelItemCtrl>

          <Observer>
            {() => {
              return (
                <this.props.children
                  {...{
                    ...this.props,
                    id,
                    isSaving,
                    isSaved,
                    onChange: this.handleChange,
                    onBlur: this.handleBlur,
                    value: model.getValue(this.props.name),
                    error
                  }}
                />
              );
            }}
          </Observer>

          {disabled &&
            disabledReason &&
            <span className="disabled-indicator tip" title={disabledReason}>
              <span className="icon-question" />
            </span>}
          {shouldShowErrorMessage && <SettingsErrorReason>{error}</SettingsErrorReason>}
        </SettingsPanelItemCtrl>
        <SettingsPanelItemCtrlState>

          {isSaving && <Spinner />}
          {isSaved && <SettingsIsSaved><IconCheckmarkSm size="18" /></SettingsIsSaved>}

          {error &&
            <SettingsError>
              <IconWarningSm size="18" />
            </SettingsError>}
        </SettingsPanelItemCtrlState>
      </SettingsPanelItemWrapper>
    );
  }
}

export default FormField;
