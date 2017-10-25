import React from 'react';
import InputField from './inputField';
import Textarea from './styled/textarea';

export default class TextareaField extends React.Component {
  static propTypes = {
    ...InputField.propTypes
  };
  render() {
    // Note we destructure `onKeyDown` from FormField so that we don't
    // listen for "enter"
    return (
      <InputField
        {...this.props}
        field={({children, onKeyDown, ...fieldProps}) => (
          <Textarea onKeyDown={this.props.onKeyDown} {...fieldProps} />
        )}
      />
    );
  }
}
