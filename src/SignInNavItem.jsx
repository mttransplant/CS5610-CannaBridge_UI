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
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // const clientId = window.ENV.GOOGLE_CLIENT_ID;
    // if (!clientId) return;
    // window.gapi.load('auth2', () => {
    //   if (!window.gapi.auth2.getAuthInstance()) {
    //     window.gapi.auth2.init({ client_id: clientId })
    //       .then(() => {
    //         this.setState({ disabled: false });
    //       });
    //   }
    // });
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    console.log(`New value for ${name}: ${textValue}`);
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      authInfo: { ...prevState.authInfo, [name]: value },
    }));
    console.log('authInfo');
    const { authInfo } = this.state;
    console.log(authInfo);
  }

  async signIn(e) {
    console.log('entered signIn()');
    e.preventDefault();
    this.hideModal();
    const { showError } = this.props;
    const { authInfo } = this.state;
    console.log('current authInfo');
    console.log(authInfo);

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      console.log('About to send signin post request');
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: authInfo }),
      });
      console.log('received signin post request');
      const body = await response.text();
      const result = JSON.parse(body);
      console.log('signin: result from json.parse(body)');
      console.log(result);
      const { onUserChange } = this.props;
      onUserChange({ user: result });
      console.log('signin: completed onUserChange');
    } catch (error) {
      showError(`Error authenticating: ${error.error}`);
    }
  }

  async signOut() {
    // const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const { showError } = this.props;
    // try {
    //   await fetch(`${apiEndpoint}/signout`, {
    //     method: 'POST',
    //     credentials: 'include',
    //   });
    //   const auth2 = window.gapi.auth2.getAuthInstance();
    //   await auth2.signOut();
    //   const { onUserChange } = this.props;
    //   onUserChange({ signedIn: false, givenName: '' });
    // } catch (error) {
    const error = 'Signout is not implemented yet';
    showError(`Error signing out: ${error}`);
    // }
  }

  showModal() {
    // const clientId = window.ENV.GOOGLE_CLIENT_ID;
    // const { showError } = this.props;
    // if (!clientId) {
    //   showError('Missing environment variable GOOGLE_CLIENT_ID');
    //   return;
    // }
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { user } = this.props;
    if (user.signedIn) {
      return (
        <NavDropdown title={user.username} id="user">
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
                      {/* <img src="https:/goo.gl/4yjp6B" alt="Sign In" /> */}
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
