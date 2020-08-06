import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Modal, Form, ButtonToolbar, Button, FormGroup,
  ControlLabel, FormControl, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
// import NumInput from './NumInput.jsx';
import withToast from './withToast.jsx';

class ItemAddNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      item: {},
    };
    this.onChange = this.onChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      item: { ...prevState.product, [name]: value },
    }));
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }


  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.itemAdd;
    const { item } = this.state;
    let query;
    const { location: { pathname } } = this.props;
    if (pathname === '/products') {
      item.title = form.title.value;
      // TODO: Update form to get type
      item.type = 'Flower';
      // TODO: update this to pull in current user
      item.poster = 'Producer A';

      query = `mutation productAdd($item: ProductInputs!) {
        productAdd(product: $item) {
            id
        }
      }`;
    } else if (pathname === '/requests') {
      item.title = form.title.value;
      // TODO: Update form to get type
      item.type = 'Flower';
      // TODO: update this to pull in current user
      item.poster = 'Producer A';
      query = `mutation requestAdd($item: RequestInputs!) {
        requestAdd(request: $item) {
            id
        }
      }`;
    }

    const { showError } = this.props;
    // TODO: Update issue to product in #Iter2

    const data = await graphQLFetch(query, { item }, showError);
    if (data) {
      const { history } = this.props;
      if (pathname === '/products') {
      // TODO: Update issueAdd to productAdd in #Iter2
        history.push(`/edit/product/${data.productAdd.id}`);
      } else {
        // TODO: Update issueAdd to productAdd in #Iter2
        history.push(`/edit/request/${data.requestAdd.id}`);
      }
    }
  }

  render() {
    const { showing } = this.state;
    // const { user: { signedIn } } = this.props;
    const signedIn = true;
    // TODO: Uncomment next line when ready in #Iter2
    // const { user: { accountType } } = this.props;
    let toolTipId;
    let formTitle;
    const { location: { pathname } } = this.props;
    if (pathname === '/products') { // TODO: Replace signedIn with accountType when available
      toolTipId = 'create-product';
      formTitle = 'Create Product';
    } else {
      toolTipId = 'create-request';
      formTitle = 'Create Request';
    }
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn && pathname !== '/products' && pathname !== '/requests'} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id={toolTipId}>{formTitle}</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{formTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="itemAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              {/* <FormGroup>
                <ControlLabel>Quantity</ControlLabel>
                <FormControl
                  componentClass={NumInput}
                  name="quantity"
                  onChange={this.onChange}
                />
              </FormGroup> */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>
                Cancel
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(withRouter(ItemAddNav));
