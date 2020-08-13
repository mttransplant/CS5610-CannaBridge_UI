import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
// import NumInput from './NumInput.jsx';
// import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class RequestEdit extends React.Component {
  static async fetchData(match, search, showError) {
    // TODO: Update query with new MongoDB in #Iter2
    const query = `query request($id: Int!) {
      request(id: $id) {
        id title type poster
        created status description
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
    return result;
  }

  constructor() {
    super();
    const request = store.initialData ? store.initialData.request : null;
    delete store.initialData;
    this.state = {
      request,
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
    const { request } = this.state;
    if (request == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      request: { ...prevState.request, [name]: value },
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
    const { request, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    // TODO: Update query in #Iter2
    const query = `mutation requestUpdate(
      $id: Int!
      $changes: RequestUpdateInputs!
    ) {
      requestUpdate(
        id: $id
        changes: $changes
      ){
        id title type poster
        created status description
      }
    }`;
    const { id, created, ...changes } = request;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { changes, id }, showError);
    if (data) {
      // TODO: UPdate data.issueUpdate to data.requestUpdate in #Iter2
      this.setState({ request: data.requestUpdate });
      showSuccess('Updated request successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await RequestEdit.fetchData(match, null, showError);
    this.setState({ request: data ? data.request : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { request } = this.state;
    if (request == null) return null;
    const { request: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Request with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationmessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationmessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const {
      request: {
        title, status, poster, type, created, description,
      },
    } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing request: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Title</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Created</Col>
              <Col sm={9}>
                <FormControl.Static>
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Posted By</Col>
              <Col sm={9}>
                <FormControl.Static>
                  {poster}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Status</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="status"
                  value={status}
                  onChange={this.onChange}
                >
                  <option value="Listed">Listed</option>
                  <option value="Unlisted">Unlisted</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Type</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="type"
                  value={type}
                  onChange={this.onChange}
                >
                  <option value="Flower">Flower</option>
                  <option value="Edible">Edible</option>
                  <option value="Topical">Topical</option>
                  <option value="PreRoll">PreRoll</option>
                  <option value="Concentrate">Concentrate</option>
                  <option value="Beverage">Beverage</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Description</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={4}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button
                    disabled={!user.signedIn}
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/requests">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationmessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/request/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/request/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

RequestEdit.contextType = UserContext;
const RequestEditWithToast = withToast(RequestEdit);
RequestEditWithToast.fetchData = RequestEdit.fetchData;
export default RequestEditWithToast;
