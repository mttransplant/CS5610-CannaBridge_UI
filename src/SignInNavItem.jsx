import React from 'react';
import {
  NavItem, Modal, Button, NavDropdown, MenuItem,
  Col, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar,
} from 'react-bootstrap';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';

class SigninNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabled: false,
      authInfo: { username: '', password: '' },
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      authInfo: { ...prevState.authInfo, [name]: value },
    }));
  }

  async signIn(e) {
    e.preventDefault();
    this.hideModal();
    const { showError } = this.props;
    const { authInfo } = this.state;

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: authInfo }),
      });
      const err = await response.clone().json();
      if (err.error) throw new Error(err.error);
      const body = await response.text();
      const result = JSON.parse(body);
      const { signedIn, firstName } = result;
      const { onUserChange } = this.props;
      onUserChange({ signedIn, firstName });
    } catch (error) {
      showError(`Authentication ${error}`);
    }
  }

  async signOut() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const { showError } = this.props;
    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const { onUserChange } = this.props;
      onUserChange({ signedIn: false, username: '' });
    } catch (error) {
      showError(`Error signing out: ${error}`);
    }
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { user } = this.props;
    if (user.signedIn) {
      return (
        <NavDropdown title={user.firstName} id="user">
          <MenuItem onClick={this.signOut}>Sign out</MenuItem>
        </NavDropdown>
      );
    }
    const { showing, disabled } = this.state;
    return (
      <>
        <NavItem onClick={this.showModal}>Sign in</NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal} bsSize="sm">
          <Modal.Header closeButton>
            <Modal.Title>Sign in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal onSubmit={this.signIn}>
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel>Username</ControlLabel>
                  <FormControl
                    componentClass={TextInput}
                    size={20}
                    name="username"
                    onChange={this.onChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    componentClass={TextInput}
                    size={20}
                    name="password"
                    onChange={this.onChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={12}>
                  <ButtonToolbar>
                    <Button
                      block
                      disabled={disabled}
                      bsStyle="primary"
                      type="submit"
                    >
                      Sign In
                    </Button>
                  </ButtonToolbar>
                </Col>
              </FormGroup>

            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={this.hideModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withToast(SigninNavItem);
