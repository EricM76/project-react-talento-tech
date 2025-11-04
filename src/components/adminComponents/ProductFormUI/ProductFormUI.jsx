import React from 'react'
import './ProductFormUI.css'

export const ProductFormUI = ({
  product,
  errors,
  loading,
  handleChange,
  handleSubmit,
  handleImageUpload
}) => {
  return (
    <>
      <h1>Agregar producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="price">Precio</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="discount">Descuento</label>
          <input type="number" name="discount" value={product.discount} onChange={handleChange} />
          {errors.discount && <p className="error">{errors.discount}</p>}
        </div>
        <div>
          <label htmlFor="section">Sección</label>
          <input type="text" name="section" value={product.section} onChange={handleChange} />
          {errors.section && <p className="error">{errors.section}</p>}
        </div>
        <div>
          <label htmlFor="brand">Marca</label>
          <input type="text" name="brand" value={product.brand} onChange={handleChange} />
          {errors.brand && <p className="error">{errors.brand}</p>}
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <input type="text" name="description" value={product.description} onChange={handleChange} />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="image">Imagen</label>
          <input type="file" name="image" onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)} />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </>
  )
}
