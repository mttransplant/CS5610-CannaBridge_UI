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

    const selectLocation = { pathname: `/requeset/${request.id}`, search };
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
        <td>{request.status}</td>
        <td>{request.owner}</td>
        <td>{request.created.toDateString()}</td>
        <td>{request.effort}</td>
        <td>{request.due ? request.due.toDateString() : ''}</td>
        <td>{request.title}</td>
        <td>
          <LinkContainer to={`/edit/request/${request.id}`}>
            <OverlayTrigger delayShow={1000} placement="top" overlay={editTooltip}>
              <Button bsSize="xsmall">
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
      <h1>Placeholder for Requests Table</h1>
      <h3>This table will only show a dispensary&apos;s own requests.</h3>
      <h3>Only cultivators will see the full list of requests.</h3>
      <Table bordered condensed hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Effort</th>
            <th>Due Date</th>
            <th>Title</th>
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
