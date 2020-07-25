import React from 'react';

export default function ProductDetail({ product }) {
  if (product) {
    return (
      <div>
        <h3>Description</h3>
        <pre>{product.description}</pre>
      </div>
    );
  }
  return null;
}
