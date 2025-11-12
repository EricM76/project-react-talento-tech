import React from 'react'
import './Products.css'

export const ProductsUI = ({
  products,
  loading,
  saving,
  error,
  expandedProductId,
  editingProductId,
  editingValues,
  editingImagePreview,
  editingImageFile,
  fileInputRef,
  categoryOptions,
  sectionOptions,
  brandOptions,
  statusOptions,
  formatCurrency,
  formatDiscount,
  formatStock,
  FALLBACK_IMAGE,
  createEditableValues,
  handleFieldChange,
  handleView,
  handleEdit,
  handleCancelEditing,
  handleSave,
  handleDelete,
  handleImageChange
}) => {
  const renderProductDetailContent = (product, isEditing, currentValues) => {
    const detailImage = product.image || product.thumbnail || FALLBACK_IMAGE
    const displayedImage = isEditing && editingImagePreview ? editingImagePreview : detailImage

    return (
      <div className="products__detail">
        <div className="products__detail-form">
          <div className="products__detail-grid">
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
            <label className="products__detail-field products__detail-field--full">
              <span>Categoría</span>
              {isEditing ? (
                <select
                  value={currentValues.category}
                  onChange={(event) => handleFieldChange('category', event.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={product.category || product.section || 'Sin categoría'} readOnly />
              )}
            </label>
          </div>
        </div>

        <div className="products__detail-bottom">
          <label className="products__detail-field products__detail-description">
            <span>Descripción</span>
            <textarea
              value={isEditing ? currentValues.description : product.description || 'Sin descripción'}
              readOnly={!isEditing}
              rows={4}
              onChange={(event) => isEditing && handleFieldChange('description', event.target.value)}
            />
          </label>

          <div className="products__detail-media">
          <figure className="products__image-wrapper">
            <figcaption>Imagen del producto</figcaption>
            <img src={displayedImage} alt={`Imagen de ${product.name}`} />
            {isEditing && (
              <>
                <button
                  type="button"
                  className="products__image-button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar imagen"
                >
                  <i className="fa-solid fa-camera-rotate" aria-hidden="true" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="products__image-input"
                  onChange={handleImageChange}
                />
              </>
            )}
          </figure>
          {isEditing && editingImageFile && (
            <p className="products__image-hint">La nueva imagen se aplicará al guardar los cambios.</p>
          )}
          </div>
        </div>
      </div>
    )
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
              <th>Estado</th>
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

            {!loading && !error && products.length === 0 && (
              <tr>
                <td colSpan={6} className="products__status">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              products.map((product) => {
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
                            value={currentValues.status}
                            onChange={(event) => handleFieldChange('status', event.target.value)}
                            aria-label={`Estado de ${product.name || 'producto'}`}
                          >
                            <option value="">Selecciona estado</option>
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="products__table-input"
                            type="text"
                            value={product.status || 'Activo'}
                            readOnly
                            aria-label={`Estado de ${product.name || 'producto'}`}
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
                                disabled={saving}
                              >
                                {saving ? 'Guardando...' : 'Guardar'}
                              </button>
                              <button
                                type="button"
                                className="products__button products__button--secondary"
                                onClick={handleCancelEditing}
                                disabled={saving}
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
        {!loading && !error && products.length === 0 && (
          <div className="products__card-status">No hay productos para mostrar.</div>
        )}

        {!loading &&
          !error &&
          products.map((product) => {
            const isExpanded = expandedProductId === product.id
            const isEditing = editingProductId === product.id
            const currentValues = isEditing
              ? editingValues || createEditableValues(product)
              : createEditableValues(product)

            return (
              <article key={product.id} className={`products__card${isExpanded ? ' is-expanded' : ''}`}>
                <header className="products__card-header">
                  <div>
                    {isEditing ? (
                      <input
                        className="products__table-input is-editable products__card-title-input"
                        type="text"
                        value={currentValues.name || 'Sin nombre'}
                        onChange={(event) => handleFieldChange('name', event.target.value)}
                        aria-label={`Nombre de ${product.name || 'producto'}`}
                      />
                    ) : (
                      <h3 className="products__card-title">{product.name}</h3>
                    )}
                  </div>
                  <div className="products__card-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="products__button products__button--primary"
                          onClick={() => handleSave(product)}
                          disabled={saving}
                        >
                          {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          className="products__button products__button--secondary"
                          onClick={handleCancelEditing}
                          disabled={saving}
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

                {isEditing && (
                  <div className="products__card-name-field">
                    <label className="products__detail-field">
                      <span>Nombre</span>
                      <input
                        className="products__table-input is-editable"
                        type="text"
                        value={currentValues.name || 'Sin nombre'}
                        onChange={(event) => handleFieldChange('name', event.target.value)}
                        aria-label={`Nombre de ${product.name || 'producto'}`}
                      />
                    </label>
                  </div>
                )}

                <div className="products__card-summary">
                  <div>
                    <span>Precio</span>
                    {isEditing ? (
                      <input
                        className="products__table-input is-editable"
                        type="number"
                        value={currentValues.price || '0'}
                        onChange={(event) => handleFieldChange('price', event.target.value)}
                        aria-label={`Precio de ${product.name || 'producto'}`}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <strong>{formatCurrency(product.price)}</strong>
                    )}
                  </div>
                  <div>
                    <span>Descuento</span>
                    {isEditing ? (
                      <input
                        className="products__table-input is-editable"
                        type="number"
                        value={currentValues.discount || '0'}
                        onChange={(event) => handleFieldChange('discount', event.target.value)}
                        aria-label={`Descuento de ${product.name || 'producto'}`}
                        min="0"
                        max="100"
                        step="1"
                      />
                    ) : (
                      <strong>{formatDiscount(product.discount)}</strong>
                    )}
                  </div>
                  <div>
                    <span>Estado</span>
                    {isEditing ? (
                      <select
                        className="products__table-select is-editable"
                        value={currentValues.status}
                        onChange={(event) => handleFieldChange('status', event.target.value)}
                        aria-label={`Estado de ${product.name || 'producto'}`}
                      >
                        <option value="">Selecciona estado</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <strong>{product.status || 'Activo'}</strong>
                    )}
                  </div>
                  <div>
                    <span>Stock</span>
                    {isEditing ? (
                      <input
                        className="products__table-input is-editable"
                        type="number"
                        value={currentValues.stock || '0'}
                        onChange={(event) => handleFieldChange('stock', event.target.value)}
                        aria-label={`Stock de ${product.name || 'producto'}`}
                        min="0"
                      />
                    ) : (
                      <strong>{formatStock(product.stock)}</strong>
                    )}
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

