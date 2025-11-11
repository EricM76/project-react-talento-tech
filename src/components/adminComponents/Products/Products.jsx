import React, { useEffect, useMemo, useState } from 'react'
import './Products.css'
import { getProducts } from '../../../services/products'

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(numericValue)
}

const formatDiscount = (value) => {
  const numericValue = Number(value) || 0
  return numericValue > 0 ? `${numericValue}%` : '—'
}

const formatStock = (value) => {
  if (value === 0) return '0'
  if (!value && value !== 0) return '—'
  return value
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/280x180.png?text=Sin+imagen'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedProductId, setExpandedProductId] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error('Error al obtener productos:', err)
        setError('No se pudieron cargar los productos. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const productsWithFallback = useMemo(
    () =>
      products.map((product) => ({
        ...product
      })),
    [products]
  )

  const renderProductDetailContent = (product) => {
    const detailImage = product.image || product.thumbnail || FALLBACK_IMAGE

    return (
      <div className="products__detail">
        <div className="products__detail-form">
          <div className="products__detail-grid">
            <label className="products__detail-field">
              <span>Nombre</span>
              <input type="text" value={product.name || ''} readOnly />
            </label>
          <div className="products__detail-inline">
            <label className="products__detail-field">
              <span>Stock</span>
              <input type="text" value={formatStock(product.stock)} readOnly />
            </label>
            <label className="products__detail-field">
              <span>Estado</span>
              <input type="text" value={product.status || 'Activo'} readOnly />
            </label>
          </div>
          <div className="products__detail-inline">
            <label className="products__detail-field">
              <span>Precio</span>
              <input type="text" value={formatCurrency(product.price)} readOnly />
            </label>
            <label className="products__detail-field">
              <span>Descuento</span>
              <input type="text" value={formatDiscount(product.discount)} readOnly />
            </label>
            <label className="products__detail-field">
              <span>Sección</span>
              <input type="text" value={product.section || 'Sin sección'} readOnly />
            </label>
          </div>
          <div className="products__detail-inline">
            <label className="products__detail-field">
              <span>Marca</span>
              <input type="text" value={product.brand || 'Sin marca'} readOnly />
            </label>
            <label className="products__detail-field">
              <span>Categoría</span>
              <input type="text" value={product.category || product.section || 'Sin categoría'} readOnly />
            </label>
          </div>
          </div>
          <label className="products__detail-field products__detail-description">
            <span>Descripción</span>
            <textarea value={product.description || 'Sin descripción'} readOnly rows={4} />
          </label>
        </div>

        <div className="products__detail-media">
          <figure>
            <img src={detailImage} alt={`Imagen de ${product.name}`} />
            <figcaption>Imagen del producto</figcaption>
          </figure>
        </div>
      </div>
    )
  }

  const handleView = (product) => {
    setExpandedProductId((prev) => (prev === product.id ? null : product.id))
  }

  const handleEdit = (product) => {
    console.log('Editar:', product)
  }

  const handleDelete = (product) => {
    console.log('Eliminar:', product)
  }

  return (
    <section className="products__container">
      <div className="products__table-wrapper">
        <table className="products__table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th className="products__actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="products__status">
                  Cargando productos...
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={6} className="products__status products__status--error">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && productsWithFallback.length === 0 && (
              <tr>
                <td colSpan={6} className="products__status">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              productsWithFallback.map((product) => {
                const isExpanded = expandedProductId === product.id

                return (
                  <React.Fragment key={product.id}>
                    <tr>
                      <td className="products__name">{product.name}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{formatDiscount(product.discount)}</td>
                      <td>{product.category || product.section || 'Sin categoría'}</td>
                      <td>{formatStock(product.stock)}</td>
                      <td>
                        <div className="products__actions">
                          <button
                            type="button"
                            className={`products__button products__button--secondary${isExpanded ? ' is-active' : ''}`}
                            onClick={() => handleView(product)}
                            aria-expanded={isExpanded}
                            aria-controls={`product-detail-${product.id}`}
                          >
                            <i className={`fa-solid ${isExpanded ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                            <span className="sr-only">Ver detalle</span>
                          </button>
                          <button
                            type="button"
                            className="products__button products__button--primary"
                            onClick={() => handleEdit(product)}
                          >
                            <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                            <span className="sr-only">Editar</span>
                          </button>
                          <button
                            type="button"
                            className="products__button products__button--danger"
                            onClick={() => handleDelete(product)}
                          >
                            <i className="fa-solid fa-trash-can" aria-hidden="true" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="products__detail-row" id={`product-detail-${product.id}`}>
                        <td colSpan={6}>
                          {renderProductDetailContent(product)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className="products__cards">
        {loading && <div className="products__card-status">Cargando productos...</div>}
        {error && !loading && <div className="products__card-status products__card-status--error">{error}</div>}
        {!loading && !error && productsWithFallback.length === 0 && (
          <div className="products__card-status">No hay productos para mostrar.</div>
        )}

        {!loading &&
          !error &&
          productsWithFallback.map((product) => {
            const isExpanded = expandedProductId === product.id

            return (
              <article key={product.id} className={`products__card${isExpanded ? ' is-expanded' : ''}`}>
                <header className="products__card-header">
                  <div>
                    <h3 className="products__card-title">{product.name}</h3>
                    {product.section && <span className="products__card-subtitle">{product.section}</span>}
                  </div>
                  <div className="products__card-actions">
                    <button
                      type="button"
                      className={`products__button products__button--secondary${isExpanded ? ' is-active' : ''}`}
                      onClick={() => handleView(product)}
                      aria-expanded={isExpanded}
                      aria-controls={`product-detail-${product.id}-card`}
                    >
                      <i className={`fa-solid ${isExpanded ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                      <span className="sr-only">Ver detalle</span>
                    </button>
                    <button
                      type="button"
                      className="products__button products__button--primary"
                      onClick={() => handleEdit(product)}
                    >
                      <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                      <span className="sr-only">Editar</span>
                    </button>
                    <button
                      type="button"
                      className="products__button products__button--danger"
                      onClick={() => handleDelete(product)}
                    >
                      <i className="fa-solid fa-trash-can" aria-hidden="true" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </header>

                <div className="products__card-summary">
                  <div>
                    <span>Precio</span>
                    <strong>{formatCurrency(product.price)}</strong>
                  </div>
                  <div>
                    <span>Descuento</span>
                    <strong>{formatDiscount(product.discount)}</strong>
                  </div>
                  <div>
                    <span>Categoría</span>
                    <strong>{product.category || product.section || 'Sin categoría'}</strong>
                  </div>
                  <div>
                    <span>Stock</span>
                    <strong>{formatStock(product.stock)}</strong>
                  </div>
                </div>

                {isExpanded && (
                  <div className="products__card-detail" id={`product-detail-${product.id}-card`}>
                    {renderProductDetailContent(product)}
                  </div>
                )}
              </article>
            )
          })}
      </div>
    </section>
  )
}
