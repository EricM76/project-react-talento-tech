import React from 'react'
import './ItemDetail.css'
import { toThousand } from '../../helpers'
import { CarouselItems } from '../CarouselItems'
import { useCart } from '../../context/useCartContext'

export const ItemDetail = ({ product, products }) => {
  const { addToCart, isInCart } = useCart()
  
  return (
    <>
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">
            Detalle del producto: {product.name}
          </h2>
        </div>
      </div>
      <div className="product-detail">
        <div className="row">
          <div className="col-12 col-lg-8">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
            />
          </div>
          <div className="col-12 col-lg-4">
            <article className="product-detail-info">
              <h2 className="product-detail-title">{product.name} </h2>
              {product.discount > 0 ? (
                <>
                  <p className="product-detail-price small">
                    <span>${product.price}</span>/<b>{product.discount}% OFF</b>
                  </p>
                  <p className="product-detail-price">$
                    {toThousand(
                      product.price - (product.price * product.discount) / 100
                    )}
                  </p>
                </>
              ) : (
                <p className="product-detail-price">$
                  {toThousand(product.price)}
                </p>
              )}

              <p className="product-detail-description">{product.description}</p>
              <div>
                <button
                  className="btn btn-primary mb-3 w-100"
                  onClick={() => addToCart(product)}
                  disabled={isInCart(product.id)}
                >
                  {isInCart(product.id) ? 'YA ESTÁ EN EL CARRITO' : 'AGREGAR AL CARRITO'}
                </button>
                <button
                  className="btn btn-primary mb-3 w-100"
                >
                  COMPRAR AHORA
                </button>
              </div>

            </article>
          </div>
        </div>
      </div>
      <CarouselItems
        products={products}
        itemsPerView={4}
      />
    </>
  )
}
