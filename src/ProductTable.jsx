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
    // TODO: After authentication is updated, make edit/delete only visible to owner.
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
        {/* TODO: Add Image Thumbnail */}
        {/* <td><Glyphicon glyph="picture" /></td> */}
        <td>{product.id}</td>
        <td>{product.title}</td>
        <td>{product.type}</td>
        <td>{product.created.toDateString()}</td>
        <td>{product.poster}</td>
        <td>{product.quantity}</td>
        <td>{product.unit}</td>
        <td>{product.price}</td>
        <td>
          <LinkContainer to={`/edit/product/${product.id}`}>
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
      <h1>List of Products</h1>
      <p>
        Note: Only users authenticated with a dispensary account will be
        able to see the full list of products.
        Users authenticated as a producer will only see their own products.
      </p>
      <Table bordered condensed hover responsive>
        <thead>
          <tr>
            {/* <th>Image</th> */}
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Date Posted</th>
            <th>Posted By</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
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
