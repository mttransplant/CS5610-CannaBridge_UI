import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Modal, Form, ButtonToolbar, Button, FormGroup,
  ControlLabel, FormControl, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class ProductAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const form = document.forms.productAdd;
    const issue = {
      // TODO: update owner to quantity when new MongoDB is ready for #Iter2
      owner: form.quantity.value,
      title: form.title.value,
      // TODO: Update due to something else useful when new MongoDB is ready
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    // TODO: Update query for new MongoDB in #Iter2
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
            id
        }
    }`;

    const { showError } = this.props;
    // TODO: Update issue to product in #Iter2
    const data = await graphQLFetch(query, { issue }, showError);
    if (data) {
      const { history } = this.props;
      // TODO: Update issueAdd to productAdd in #Iter2
      history.push(`/edit/product/${data.issueAdd.id}`);
    }
  }


  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-product">Create Product</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="productAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Quantity</ControlLabel>
                <FormControl name="quantity" />
              </FormGroup>
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

export default withToast(withRouter(ProductAddNavItem));
