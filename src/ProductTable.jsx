import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ProductRowPlain extends React.Component {
  render() {
    const {
      product,
      location: { search },
      closeProduct,
      deleteProduct,
      index,
    } = this.props;
    const user = this.context;
    // TODO: After authentication is updated, only make edit/delete visible to owner.
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/products/${product.id}`, search };
    const editTooltip = (<Tooltip id="edit-tooltip">Edit Product</Tooltip>);
    const closeTooltip = (<Tooltip id="close-tooltip">Close Product</Tooltip>);
    const deleteTooltip = (<Tooltip id="delete-tooltip">Delete Product</Tooltip>);

    function onDelete(e) {
      e.preventDefault();
      deleteProduct(index);
    }

    function onClose(e) {
      e.preventDefault();
      closeProduct(index);
    }

    const tableRow = (
      <tr>
        <td>{product.id}</td>
        <td>{product.status}</td>
        <td>{product.owner}</td>
        <td>{product.created.toDateString()}</td>
        <td>{product.effort}</td>
        <td>{product.due ? product.due.toDateString() : ''}</td>
        <td>{product.title}</td>
        <td>
          <LinkContainer to={`/edit/product/${product.id}`}>
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

ProductRowPlain.contextType = UserContext;
const ProductRow = withRouter(ProductRowPlain);
delete ProductRow.contextType;

export default function ProductTable({ products, closeProduct, deleteProduct }) {
  const productRows = products.map((product, index) => (
    <ProductRow
      key={product.id}
      product={product}
      closeProduct={closeProduct}
      deleteProduct={deleteProduct}
      index={index}
    />
  ));

  return (
    <div>
      <h1>Placeholder for Products Table</h1>
      <h3>This table will only show a producer&apos;s own products.</h3>
      <h3>Only dispensaries will see the full list of products.</h3>
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
          {productRows}
        </tbody>
      </Table>
    </div>
  );
}
