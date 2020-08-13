/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  Button, ButtonToolbar, FormGroup, FormControl, ControlLabel, InputGroup, Row, Col,
} from 'react-bootstrap';

class ListFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      type: params.get('type') || '',
      dateMin: params.get('dateMin') || '',
      dateMax: params.get('dateMax') || '',
      changed: false,
    };
    this.onChangeType = this.onChangeType.bind(this);
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

  onChangeType(e) {
    this.setState({ type: e.target.value, changed: true });
  }

  onChangeDateMin(e) {
    const dateString = e.target.value;
    if (dateString.match(/^[\d-]*$/)) {
      this.setState({ dateMin: e.target.value, changed: true });
    }
  }

  onChangeDateMax(e) {
    const dateString = e.target.value;
    if (dateString.match(/^[\d-]*$/)) {
      this.setState({ dateMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      type: params.get('type') || '',
      dateMin: params.get('dateMin') || '',
      dateMax: params.get('dateMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { type, dateMin, dateMax } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (dateMin) params.set('dateMin', dateMin);
    if (dateMax) params.set('dateMax', dateMax);
    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { type, changed } = this.state;
    const { dateMin, dateMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Type:</ControlLabel>
            <FormControl
              componentClass="select"
              value={type}
              onChange={this.onChangeType}
            >
              <option value="">(All)</option>
              <option value="Flower">Flower</option>
              <option value="Edible">Edible</option>
              <option value="Topical">Topical</option>
              <option value="PreRoll">PreRoll</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Beverage">Beverage</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Date Posted between:</ControlLabel>
            <InputGroup>
              <FormControl
                default="yyyy-mm-dd"
                value={dateMin}
                onChange={this.onChangeDateMin}
              />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl
                default="yyyy-mm-dd"
                value={dateMax}
                onChange={this.onChangeDateMax}
              />
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

export default withRouter(ListFilter);
