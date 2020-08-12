import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class RequestRowPlain extends React.Component {
  render() {
    const {
      request,
      location: { search },
      closeRequest,
      deleteRequest,
      index,
    } = this.props;
    const user = this.context;
    // TODO: After authentication is updated, only make edit/delete visible to owner.
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/requests/${request.id}`, search };
    const editTooltip = (<Tooltip id="edit-tooltip">Edit Request</Tooltip>);
    const closeTooltip = (<Tooltip id="close-tooltip">Close Request</Tooltip>);
    const deleteTooltip = (<Tooltip id="delete-tooltip">Delete Request</Tooltip>);

    function onDelete(e) {
      e.preventDefault();
      deleteRequest(index);
    }

    function onClose(e) {
      e.preventDefault();
      closeRequest(index);
    }

    const tableRow = (
      <tr>
        <td>{request.id}</td>
        <td>{request.title}</td>
        <td>{request.type}</td>
        <td>{request.created.toDateString()}</td>
        <td>{request.poster}</td>
        <td>
          <LinkContainer to={`/edit/request/${request.id}`}>
            <OverlayTrigger delayShow={1000} placement="top" overlay={editTooltip}>
              <Button disabled={disabled} bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} placement="top" overlay={closeTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onClose}>
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
          {'  '}
          <OverlayTrigger delayShow={1000} placement="top" overlay={deleteTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDelete}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );
    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

RequestRowPlain.contextType = UserContext;
const RequestRow = withRouter(RequestRowPlain);
delete RequestRow.contextType;

export default function RequestTable({ requests, closeRequest, deleteRequest }) {
  const requestRows = requests.map((request, index) => (
    <RequestRow
      key={request.id}
      request={request}
      closeRequest={closeRequest}
      deleteRequest={deleteRequest}
      index={index}
    />
  ));

  return (
    <div>
      <h1>List of Requests</h1>
      <p>
        Note: Only users authenticated with a producer account will be
        able to see the full list of requests.
        Users authenticated as a dispensary will only see their own requests.
      </p>
      <Table bordered condensed hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Date Posted</th>
            <th>Posted By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requestRows}
        </tbody>
      </Table>
    </div>
  );
}
