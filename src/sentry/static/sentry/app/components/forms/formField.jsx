import classNames from 'classnames';
import {Observer, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {defined} from '../../utils';
import FormState from './state';

@observer
class FormField extends React.Component {
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
    value: PropTypes.any,
  };

  static defaultProps = {
    hideErrorMessage: false,
    disabled: false,
    required: false,
  };

  static contextTypes = {
    form: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.getValue(props, context),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // XXX merge
    // if (
    // this.props.value !== nextProps.value ||
    // (!defined(this.context.form) && defined(nextContext.form))
    // ) {
    // this.setValue(this.getValue(nextProps, nextContext));
    // }
  }

  componentWillUnmount() {
    //this.removeTooltips();
    jQuery(ReactDOM.findDOMNode(this)).unbind();
  }

  getValue(props, context) {
    let form = (context || this.context || {}).form;
    props = props || this.props;
    if (defined(props.value)) {
      return props.value;
    }
    if (form && form.data.hasOwnProperty(props.name)) {
      return form.data[props.name];
    }
    return props.defaultValue || '';
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

  setValue = value => {
    let form = (this.context || {}).form;
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChange && this.props.onChange(this.coerceValue(this.state.value));
        form && form.onFieldChange(this.props.name, this.coerceValue(this.state.value));
      }
    );
  };

  handleBlur = e => {
    if (!this.context.saveOnBlur) return;

    this.context.form.saveField(this.props.name, e.currentTarget.value);
  };

  render() {
    let {
      className,
      required,
      label,
      disabled,
      disabledReason,
      hideErrorMessage,
      help,
      style,
    } = this.props;
    let error = this.getError();
    let cx = classNames(className, this.getClassName(), {
      'has-error': !!error,
      required,
    });
    let shouldShowErrorMessage = error && !hideErrorMessage;
    let id = this.getId();
    let model = this.context.form;

    return (
      <div style={style} className={cx}>
        <div className="controls">
          {label && (
            <label htmlFor={this.getId()} className="control-label">
              {label}
            </label>
          )}
          {this.getField()}
          {disabled &&
            disabledReason && (
              <span className="disabled-indicator tip" title={disabledReason}>
                <span className="icon-question" />
              </span>
            )}
          {defined(help) && <p className="help-block">{help}</p>}
          {shouldShowErrorMessage && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormField;
