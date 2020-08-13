import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
// import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class ProductEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id title type poster
        created quantity unit price
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
    return result;
  }

  constructor() {
    super();
    const product = store.initialData ? store.initialData.product : null;
    delete store.initialData;
    this.state = {
      product,
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
    const { product } = this.state;
    if (product == null) this.loadData();
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
      product: { ...prevState.product, [name]: value },
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
    const { product, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    const query = `mutation productUpdate(
      $id: Int!
      $changes: ProductUpdateInputs!
    ) {
      productUpdate(
        id: $id
        changes: $changes
      ){
        id title type poster
        created quantity unit price
      }
    }`;
    const { id, created, ...changes } = product;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { changes, id }, showError);
    if (data) {
      this.setState({ product: data.productUpdate });
      showSuccess('Updated product successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await ProductEdit.fetchData(match, null, showError);
    this.setState({ product: data ? data.product : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { product } = this.state;
    if (product == null) return null;
    const { product: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
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
      product: {
        title, status, type, poster, quantity, unit, price, description, created,
      },
    } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing product: ${id}`}</Panel.Title>
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
              <Col componentClass={ControlLabel} sm={3}>Poster</Col>
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
              <Col componentClass={ControlLabel} sm={3}>Quantity</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="quantity"
                  value={quantity}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Unit</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="unit"
                  value={unit}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Price</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            {/* <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Image</Col>
              <Col sm={9}>
                <input
                  type="file"
                  className="image-upload"
                />
              </Col>
            </FormGroup> */}

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
                  <LinkContainer to="/products">
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
          <Link to={`/edit/product/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/product/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

ProductEdit.contextType = UserContext;
const IssueEditWithToast = withToast(ProductEdit);
IssueEditWithToast.fetchData = ProductEdit.fetchData;
export default IssueEditWithToast;
