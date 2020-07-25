/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  Button, ButtonToolbar, FormGroup, FormControl, ControlLabel, InputGroup, Row, Col,
} from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      dateMin: params.get('dateMin') || '', // changed effortMin to dateMin
      dateMax: params.get('dateMax') || '', // changed effortMax to dateMax
      changed: false,
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeDateMin = this.onChangeDateMin.bind(this);
    this.onChangeDateMax = this.onChangeDateMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  onChangeDateMin(e) {
    const dateString = e.target.value;
    if (dateString.match(/^\d*$/)) {
      this.setState({ dateMin: e.target.value, changed: true });
    }
  }

  onChangeDateMax(e) {
    const dateString = e.target.value;
    if (dateString.match(/^\d*$/)) {
      this.setState({ dateMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      dateMin: params.get('dateMin') || '',
      dateMax: params.get('dateMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { status, dateMin, dateMax } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (dateMin) params.set('dateMin', dateMin);
    if (dateMax) params.set('dateMax', dateMax);
    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { status, changed } = this.state;
    const { dateMin, dateMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Status:</ControlLabel>
            <FormControl
              componentClass="select"
              value={status}
              onChange={this.onChangeStatus}
            >
              <option value="">(All)</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Posted date between:</ControlLabel>
            <InputGroup>
              <FormControl value={dateMin} onChange={this.onChangeDateMin} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={dateMax} onChange={this.onChangeDateMax} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <ControlLabel>&nbsp;</ControlLabel>
          <ButtonToolbar>
            <Button bsStyle="primary" type="button" onClick={this.applyFilter}>Apply</Button>
            <Button
              type="button"
              onClick={this.showOriginalFilter}
              disabled={!changed}
            >
              Reset
            </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    );
  }
}

export default withRouter(IssueFilter);
