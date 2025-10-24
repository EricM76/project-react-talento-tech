import React from 'react'
import './ItemList.css'
import { Item } from '../Item';
import { ItemSkeleton } from '../Item/ItemSkeleton';
import { Link } from 'react-router-dom';

export const ItemList = ({ products, loading }) => {

  return (
    <div className="container products-wrapper">
      <div className="row">
        {loading ? (
          <>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </>
        ) : products.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              No hay productos
            </div>
          </div>
        ) : (
          products.map((product, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product.id + index}>
              <Link to={`/products/${product.id}`}>
                <Item
                  product={product}
                />
              </Link>
            </div>
          ))
        )}
        </div>
    </div>
  );
}
