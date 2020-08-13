import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Modal, Form, ButtonToolbar, Button, FormGroup,
  ControlLabel, FormControl, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
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
    const { user: { businessType } } = this.props;
    if (businessType === 'Cultivator') {
      item.title = form.title.value;
      // TODO: Update form to get type
      item.type = 'Flower';
      const { user: { username } } = this.props;
      item.poster = username;

      query = `mutation productAdd($item: ProductInputs!) {
        productAdd(product: $item) {
            id
        }
      }`;
    } else if (businessType === 'Dispensary') {
      item.title = form.title.value;
      // TODO: Update form to get type
      item.type = 'Flower';
      const { user: { username } } = this.props;
      item.poster = username;
      query = `mutation requestAdd($item: RequestInputs!) {
        requestAdd(request: $item) {
            id
        }
      }`;
    }

    const { showError } = this.props;

    const data = await graphQLFetch(query, { item }, showError);
    if (data) {
      const { history } = this.props;
      if (businessType === 'Cultivator') {
        history.push(`/edit/product/${data.productAdd.id}`);
      } else {
        history.push(`/edit/request/${data.requestAdd.id}`);
      }
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    const { user: { businessType } } = this.props;
    let toolTipId;
    let formTitle;
    if (businessType === 'Cultivator') {
      toolTipId = 'create-product';
      formTitle = 'Create Product';
    } else {
      toolTipId = 'create-request';
      formTitle = 'Create Request';
    }
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
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
