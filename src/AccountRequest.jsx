import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import graphQLFetch from './graphQLFetch.js';

class AccountRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      newAccount: {
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        businessName: null,
        businessWebsite: null,
        businessType: null,
      },
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    // what will I need here?
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      newAccount: { ...prevState.newAccount, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { newAccount, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    // TODO: update query when account database is ready
    const query = '';
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { newAccount }, showError);
    if (data) {
      // TODO: Update data.issueUpdate to data.newAccountUpdate in #Iter2
      this.setState({ newAccount: data.issueUpdate });
      showSuccess('Requested new account successfully');
    }
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { invalidFields, showingValidation } = this.state;
    let validationmessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationmessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>Requesting an Account</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>First Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="firstName"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Last Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="lastName"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Phone</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="phone"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Email</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="email"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Business Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="businessName"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Business Website</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="businessWebsite"
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Business Type</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="businessType"
                  value="Dispensary"
                  onChange={this.onChange}
                >
                  <option value="Dispensary">Dispensary</option>
                  <option value="Cultivator">Cultivator</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button
                    disabled={Object.keys(invalidFields).length !== 0 && showingValidation}
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/">
                    <Button bsStyle="link">Cancel</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationmessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default withToast(AccountRequest);
