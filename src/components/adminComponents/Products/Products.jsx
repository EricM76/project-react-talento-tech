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

const createEditableValues = (product = {}) => ({
  name: product.name || '',
  price: product.price !== undefined && product.price !== null ? String(product.price) : '',
  discount: product.discount !== undefined && product.discount !== null ? String(product.discount) : '',
  category: product.category || product.section || '',
  section: product.section || '',
  stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '',
  brand: product.brand || '',
  status: product.status || 'Activo',
  description: product.description || ''
})

export const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedProductId, setExpandedProductId] = useState(null)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingValues, setEditingValues] = useState(null)

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

  const categoryOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.category) values.add(product.category)
      if (product.section) values.add(product.section)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const sectionOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.section) values.add(product.section)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const brandOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.brand) values.add(product.brand)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const statusOptions = useMemo(() => {
    const values = new Set(['Activo', 'Inactivo'])
    productsWithFallback.forEach((product) => {
      if (product.status) values.add(product.status)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const handleFieldChange = (field, value) => {
    setEditingValues((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const renderProductDetailContent = (product, isEditing, currentValues) => {
    const detailImage = product.image || product.thumbnail || FALLBACK_IMAGE

    return (
      <div className="products__detail">
        <div className="products__detail-form">
          <div className="products__detail-grid">
            <label className="products__detail-field">
              <span>Estado</span>
              {isEditing ? (
                <select
                  value={currentValues.status}
                  onChange={(event) => handleFieldChange('status', event.target.value)}
                >
                  <option value="">Selecciona estado</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={product.status || 'Activo'} readOnly />
              )}
            </label>
            <label className="products__detail-field">
              <span>Sección</span>
              {isEditing ? (
                <select
                  value={currentValues.section}
                  onChange={(event) => handleFieldChange('section', event.target.value)}
                >
                  <option value="">Sin sección</option>
                  {sectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={product.section || 'Sin sección'} readOnly />
              )}
            </label>
            <label className="products__detail-field">
              <span>Marca</span>
              {isEditing ? (
                <select
                  value={currentValues.brand}
                  onChange={(event) => handleFieldChange('brand', event.target.value)}
                >
                  <option value="">Sin marca</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={product.brand || 'Sin marca'} readOnly />
              )}
            </label>
          </div>
          <label className="products__detail-field products__detail-description">
            <span>Descripción</span>
            <textarea
              value={isEditing ? currentValues.description : product.description || 'Sin descripción'}
              readOnly={!isEditing}
              rows={4}
              onChange={(event) => isEditing && handleFieldChange('description', event.target.value)}
            />
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
    if (editingProductId === product.id) {
      return
    }
    setExpandedProductId((prev) => (prev === product.id ? null : product.id))
  }

  const handleEdit = (product) => {
    setExpandedProductId(product.id)
    setEditingProductId(product.id)
    setEditingValues(createEditableValues(product))
  }

  const handleCancelEditing = () => {
    setEditingProductId(null)
    setEditingValues(null)
  }

  const parseNumberValue = (value, fallback = 0) => {
    if (value === '' || value === null || value === undefined) {
      return fallback
    }
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? fallback : numericValue
  }

  const handleSave = (product) => {
    if (!editingValues) {
      return
    }

    const updatedProduct = {
      ...product,
      name: editingValues.name.trim(),
      price: parseNumberValue(editingValues.price, product.price || 0),
      discount: parseNumberValue(editingValues.discount, product.discount || 0),
      category: editingValues.category || editingValues.section || '',
      section: editingValues.section,
      stock: parseNumberValue(editingValues.stock, product.stock || 0),
      brand: editingValues.brand,
      status: editingValues.status || product.status || 'Activo',
      description: editingValues.description
    }

    setProducts((prevProducts) =>
      prevProducts.map((item) => (item.id === product.id ? updatedProduct : item))
    )
    setEditingProductId(null)
    setEditingValues(null)
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
                const isEditing = editingProductId === product.id
                const currentValues = isEditing
                  ? editingValues || createEditableValues(product)
                  : createEditableValues(product)

                return (
                  <React.Fragment key={product.id}>
                    <tr>
                      <td className="products__name">
                        <input
                          className={`products__table-input${isEditing ? ' is-editable' : ''}`}
                          type="text"
                          value={isEditing ? currentValues.name : product.name || 'Sin nombre'}
                          readOnly={!isEditing}
                          aria-label={`Nombre de ${product.name || 'producto'}`}
                          onChange={(event) => isEditing && handleFieldChange('name', event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={`products__table-input${isEditing ? ' is-editable' : ''}`}
                          type={isEditing ? 'number' : 'text'}
                          value={isEditing ? currentValues.price : formatCurrency(product.price)}
                          readOnly={!isEditing}
                          aria-label={`Precio de ${product.name || 'producto'}`}
                          onChange={(event) => isEditing && handleFieldChange('price', event.target.value)}
                          min={isEditing ? '0' : undefined}
                          step={isEditing ? '0.01' : undefined}
                        />
                      </td>
                      <td>
                        <input
                          className={`products__table-input${isEditing ? ' is-editable' : ''}`}
                          type={isEditing ? 'number' : 'text'}
                          value={isEditing ? currentValues.discount : formatDiscount(product.discount)}
                          readOnly={!isEditing}
                          aria-label={`Descuento de ${product.name || 'producto'}`}
                          onChange={(event) => isEditing && handleFieldChange('discount', event.target.value)}
                          min={isEditing ? '0' : undefined}
                          max={isEditing ? '100' : undefined}
                          step={isEditing ? '1' : undefined}
                        />
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="products__table-select is-editable"
                            value={currentValues.category}
                            onChange={(event) => handleFieldChange('category', event.target.value)}
                            aria-label={`Categoría de ${product.name || 'producto'}`}
                          >
                            <option value="">Sin categoría</option>
                            {categoryOptions.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="products__table-input"
                            type="text"
                            value={product.category || product.section || 'Sin categoría'}
                            readOnly
                            aria-label={`Categoría de ${product.name || 'producto'}`}
                          />
                        )}
                      </td>
                      <td>
                        <input
                          className={`products__table-input${isEditing ? ' is-editable' : ''}`}
                          type={isEditing ? 'number' : 'text'}
                          value={isEditing ? currentValues.stock : formatStock(product.stock)}
                          readOnly={!isEditing}
                          aria-label={`Stock de ${product.name || 'producto'}`}
                          onChange={(event) => isEditing && handleFieldChange('stock', event.target.value)}
                          min={isEditing ? '0' : undefined}
                        />
                      </td>
                      <td>
                        <div className="products__actions">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="products__button products__button--primary"
                                onClick={() => handleSave(product)}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="products__button products__button--secondary"
                                onClick={handleCancelEditing}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="products__detail-row" id={`product-detail-${product.id}`}>
                        <td colSpan={6}>
                          {renderProductDetailContent(product, isEditing, currentValues)}
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
            const isEditing = editingProductId === product.id
            const currentValues = isEditing
              ? editingValues || createEditableValues(product)
              : createEditableValues(product)

            return (
              <article key={product.id} className={`products__card${isExpanded ? ' is-expanded' : ''}`}>
                <header className="products__card-header">
                  <div>
                    <h3 className="products__card-title">{isEditing ? currentValues.name || 'Sin nombre' : product.name}</h3>
                    {(isEditing ? currentValues.section : product.section) && (
                      <span className="products__card-subtitle">
                        {isEditing ? currentValues.section : product.section}
                      </span>
                    )}
                  </div>
                  <div className="products__card-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="products__button products__button--primary"
                          onClick={() => handleSave(product)}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="products__button products__button--secondary"
                          onClick={handleCancelEditing}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </header>

                <div className="products__card-summary">
                  <div>
                    <span>Precio</span>
                    <strong>{isEditing ? currentValues.price || '0' : formatCurrency(product.price)}</strong>
                  </div>
                  <div>
                    <span>Descuento</span>
                    <strong>{isEditing ? `${currentValues.discount || 0}%` : formatDiscount(product.discount)}</strong>
                  </div>
                  <div>
                    <span>Categoría</span>
                    <strong>{isEditing ? currentValues.category || 'Sin categoría' : product.category || product.section || 'Sin categoría'}</strong>
                  </div>
                  <div>
                    <span>Stock</span>
                    <strong>{isEditing ? currentValues.stock || '0' : formatStock(product.stock)}</strong>
                  </div>
                </div>

                {isExpanded && (
                  <div className="products__card-detail" id={`product-detail-${product.id}-card`}>
                    {renderProductDetailContent(product, isEditing, currentValues)}
                  </div>
                )}
              </article>
            )
          })}
      </div>
    </section>
  )
}
