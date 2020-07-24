import React from 'react';

function displayFormat(date) {
  return (date != null) ? date.toDateString() : '';
}

function editFormat(date) {
  return (date != null) ? date.toISOString().substr(0, 10) : '';
}

function unformat(str) {
// the following is to account for when a new date is created from a string
// formatted as 'yyyy-mm-dd', it's created in UTC/GMT not the local timezone.
// This was creating an issue that after the focus was given to the Due date
// field and then lost the date would appear to lose a day when 'displayFormat'
// was called.

  let val = new Date(str);
  if (str.length === 0 || Number.isNaN(val.getTime())) { return null; }

  const ymd = str.split('-');

  switch (ymd.length) {
    case 3:
      val = new Date(ymd[0], ymd[1] - 1, ymd[2]);
      break;
    case 2:
      val = new Date(ymd[0], ymd[1] - 1, 1);
      break;
    case 1:
      val = new Date(ymd[0], 0, 1);
      break;
    default:
      val = null;
  }

  return val;
}

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: editFormat(props.value),
      focused: false,
      valid: true,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur(e) {
    const { value, valid: oldValid } = this.state;
    const { onValidityChange, onChange } = this.props;
    const dateValue = unformat(value);
    const valid = value === '' || dateValue != null;
    if (valid !== oldValid && onValidityChange) {
      onValidityChange(e, valid);
    }
    this.setState({ focused: false, valid });
    if (valid) onChange(e, dateValue);
  }

  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  render() {
    const { valid, focused, value } = this.state;
    const { value: origValue, onValidityChange, ...props } = this.props;
    const displayValue = (focused || !valid) ? value : displayFormat(origValue);
    return (
      <input
        {...props}
        value={displayValue}
        placeholder={focused ? 'yyyy-mm-dd' : null}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}
