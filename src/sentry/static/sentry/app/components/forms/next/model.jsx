import {observable, computed, action} from 'mobx';
import _ from 'lodash';

import {Client} from '../../../api';
import FormState from '../state';

class FormModel {
  @observable fields = new Map();
  @observable errors = new Map();
  @observable required = new Map();
  @observable fieldState = new Map();
  @observable formState;
  snapshots = [];
  initialData = {};

  constructor({initialData, ...options} = {}) {
    this.setFormOptions(options);

    if (initialData) {
      this.setInitialData(initialData);
    }

    this.api = new Client();
  }

  @computed get formChanged() {
    return !_.isEqual(this.initialData.toJSON(), this.fields.toJSON(), true);
  }

  @computed get formData() {
    return this.fields;
  }

  @computed get isSaving() {
    return this.formState === FormState.SAVING;
  }

  @computed get isError() {
    return !!Array.from(this.errors.values()).find(val => !!val);
  }

  /**
   * Sets initial form data
   *
   * Also resets snapshots
   */
  setInitialData(initialData, {noResetSnapshots} = {}) {
    this.fields.replace(initialData || {});
    this.initialData = this.fields.toJSON() || {};

    if (noResetSnapshots) return;

    this.snapshots = [new Map(this.fields)];
  }

  setFormOptions(options) {
    this.options = options || {};
  }

  createSnapshot() {}

  getFieldState(id) {
    return this.fieldState.has(id) && this.fieldState.get(id);
  }

  getValue(id) {
    if (!this.fields.has(id)) {
      return '';
    }

    return this.fields.get(id);
  }

  getError(id) {
    return this.errors.has(id) && this.errors.get(id);
  }

  // Returns true if not required or is required and is not empty
  isValidRequiredField(id) {
    return !this.required.has(id) || !this.required.get(id) || this.getValue(id) !== '';
  }

  isValidField(id) {
    return this.isValidRequiredField(id);
  }

  doApiRequest({apiEndpoint, apiMethod, data}) {
    let endpoint = apiEndpoint || this.options.apiEndpoint;
    let method = apiMethod || this.options.apiMethod;

    return new Promise((resolve, reject) => {
      this.api.request(endpoint, {
        method,
        data,
        success: response => resolve(response),
        error: error => reject(error)
      });
    });
  }

  @action setValue(id, value) {
    this.fields.set(id, value);

    // specifically check for empty string, 0 should be allowed
    if (!this.isValidRequiredField(id)) {
      this.setError(id, 'Field is required');
    } else {
      this.setError(id, false);
    }
  }

  @action addField(id, {required}) {
    // if (!this.fields.has(id)) {
    // this.fields.set(id, '');
    // }
    this.required.set(id, required);
  }

  @action undo() {
    // Always have initial data snapshot
    if (this.snapshots.length < 2) return;

    this.snapshots.shift();
    this.fields.replace(this.snapshots[0]);
  }

  @action saveField(id, currentValue) {
    // Don't save if field hasn't changed
    if (
      currentValue === this.initialData[id] ||
      (currentValue === '' && typeof this.initialData[id] === 'undefined')
    )
      return null;

    // Check for error first
    if (!this.isValidField(id)) return null;

    // shallow clone fields
    let snapshot = new Map(this.fields);
    let newValue = this.getValue(id);

    // Save field + value
    this.setFieldState(id, FormState.SAVING);

    if (!this.options.saveOnBlur) return null;

    return this.doApiRequest({
      data: {
        [id]: currentValue
        // ...formData,
        // safeFields: extractMultilineFields(formData.safeFields),
        // sensitiveFields: extractMultilineFields(formData.sensitiveFields)
      }
    })
      .then(data => {
        // Pretend async req
        this.setFieldState(id, FormState.READY);
        this.initialData[id] = newValue;
        this.snapshots.unshift(snapshot);

        if (this.options.onSubmitSuccess) {
          this.options.onSubmitSuccess(data);
        }

        return data;
      })
      .catch(error => {
        this.setFieldState(id, FormState.ERROR);

        if (this.options.onSubmitError) {
          this.options.onSubmitError(error);
        }

        // this.initialData[id] = newValue;
        // this.snapshots.unshift(snapshot);
        return error;
      });
  }

  @action setFieldState(id, value) {
    this.fieldState.set(id, value);
  }

  @action setError(id, error) {
    if (!!error) {
      this.formState = FormState.ERROR;
    } else {
      this.formState = FormState.READY;
    }

    this.errors.set(id, error);
  }

  @action setRequired(id, required) {
    this.required.set(id, required);
  }

  @action getData() {
    return this.fields;
  }

  // TODO: More validations
  @action validate() {}

  @action submitSuccess(data) {
    // update initial data
    this.formState = FormState.READY;
    this.initialData = data;
  }

  @action submitError(err) {
    this.formState = FormState.ERROR;
    this.formErrors = err.responseJSON;
  }
}

export default FormModel;
