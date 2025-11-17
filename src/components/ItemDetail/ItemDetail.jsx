import React from 'react'
import './ItemDetail.css'
import { toThousand } from '../../utils'
import { CarouselItems } from '../CarouselItems'
import { useCart } from '../../context/useCartContext'
import { Link } from 'react-router-dom'

export const ItemDetail = ({ product, products }) => {
  const { addToCart, isInCart } = useCart()
  
  // Si el producto no existe, mostrar vista de "no encontrado"
  if (!product) {
    return (
      <div className="product-not-found">
        <div className="row">
          <div className="col-12">
            <div className="not-found-container">
              <div className="not-found-icon">
                <i className="fas fa-search"></i>
              </div>
              <h2 className="not-found-title">Producto no encontrado</h2>
              <p className="not-found-message">
                Lo sentimos, el producto que estás buscando no existe o ha sido eliminado de nuestra base de datos.
              </p>
              <div className="not-found-actions">
                <Link to="/products" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Ver todos los productos
                </Link>
                <Link to="/" className="btn btn-outline-primary">
                  <i className="fas fa-home me-2"></i>
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
        {products && products.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="products-title">Productos relacionados</h3>
            </div>
          </div>
        )}
        {products && products.length > 0 && (
          <CarouselItems
            products={products}
            itemsPerView={4}
          />
        )}
      </div>
    )
  }
  
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
