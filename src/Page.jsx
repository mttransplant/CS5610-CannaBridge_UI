import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown, Grid, Col, MenuItem, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Search from './Search.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import Contents from './Contents.jsx';
import ItemAddNav from './ItemAddNav.jsx';
import SignInNavItem from './SignInNavItem.jsx';

function NavBar({ user, onUserChange }) {
  return (
    <Navbar>
      <Navbar.Header>
        {/* Navbar.Brand gives specific sytyling */}
        <Navbar.Brand>CannaBridge</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        {/* LinkContainer provides the same functionality as NavLink,
        but without the styling of <a> */}
        <LinkContainer exact to="/">
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer to="/products">
          <NavItem>Product List</NavItem>
        </LinkContainer>
        <LinkContainer to="/requests">
          <NavItem>Request List</NavItem>
        </LinkContainer>
        {/* <LinkContainer to="/report">
          <NavItem>Report</NavItem>
        </LinkContainer> */}
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <Search />
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <ItemAddNav user={user} />
        <SignInNavItem user={user} onUserChange={onUserChange} />
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="option-vertical" />}
          noCaret
        >
          <LinkContainer to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
          <LinkContainer to="/contact">
            <MenuItem>Contact Us</MenuItem>
          </LinkContainer>
          <LinkContainer to="/accountrequest">
            <MenuItem>Request an Account</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_CannaBridge_UI">
          GitHub respository
        </a>
      </p>
    </small>
  );
}

export default class Page extends React.Component {
  static async fetchData(cookie) {
    console.log('Inside Page.fetchData, with cookie:');
    console.log(cookie);
    const query = 'query { user { id username}}';
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };
    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    console.log(`Page.didMount, user is: ${user}`);
    if (user == null) {
      console.log('Page.didMount, inside if(user==null)');
      const data = await Page.fetchData();
      console.log(`Data returned to Page.didMount: ${data}`);
      if (data) {
        this.setState({ user: data.user });
      } else {
        this.setState({ user: { signedIn: false } });
      }
    }
  }

  onUserChange(user) {
    console.log('Page.onuserChange: about to set user status');
    console.log(user);
    this.setState({ user });
    // eslint-disable-next-line react/destructuring-assignment
    const currentUser = this.state.user;
    console.log('Page.onUserChange: new user is:');
    console.log(currentUser);
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;
    return (
      <div>
        <NavBar user={user} onUserChange={this.onUserChange} />
        {/* Personal Reminder: <Grid fluid> is what gives the margins
      around the elements in Contents */}
        <Grid fluid>
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </Grid>
        <Footer />
      </div>
    );
  }
}
