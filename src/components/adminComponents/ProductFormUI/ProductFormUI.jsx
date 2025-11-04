import React, { useState, useEffect } from 'react'
import './ProductFormUI.css'
import { getProducts } from '../../../services/products'

export const ProductFormUI = ({
  product,
  errors,
  loading,
  onChange,
  onBlur,
  onSubmit,
  onImageUpload
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Cargar categorías y extraer secciones y marcas
    const loadOptions = async () => {
      try {
        // Cargar categorías
        const categoriesResponse = await fetch('/data/categories.json');
        const categoriesData = await categoriesResponse.json();
        setCategoriesData(categoriesData);
        setCategories(categoriesData.map(cat => cat.name));

        // Cargar productos para extraer marcas y secciones únicas
        const productsData = await getProducts();
        
        // Extraer marcas únicas
        const uniqueBrands = [...new Set(productsData.map(p => p.brand).filter(Boolean))].sort();
        setBrands(uniqueBrands);

        // Extraer secciones únicas
        const uniqueSections = [...new Set(productsData.map(p => p.section).filter(Boolean))].sort();
        setSections(uniqueSections);
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    // Cargar subcategorías cuando se seleccione una categoría
    if (product.category) {
      const selectedCategory = categoriesData.find(cat => cat.name === product.category);
      if (selectedCategory && selectedCategory.sub) {
        setSubcategories(selectedCategory.sub);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [product.category, categoriesData]);

  useEffect(() => {
    // Limpiar la URL de vista previa cuando el componente se desmonte
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    
    if (file) {
      // Crear vista previa de la imagen
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      onImageUpload(file);
    } else {
      setImagePreview(null);
      onImageUpload(null);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h1 className="product-form-title">Agregar producto</h1>
        </div>
      </div>
      <div className="product-form-container">
        <form onSubmit={onSubmit} className="product-form">
          <div className="row">
            {/* Vista previa de imagen - 6 columnas en tablet, 5 en desktop */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="image-preview-section">
                <label htmlFor="image" className="form-label">Imagen</label>
                <div className="image-preview-container">
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img 
                        src={imagePreview} 
                        alt="Vista previa" 
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="image-preview-remove"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          onImageUpload(null);
                          // Resetear el input file
                          const fileInput = document.getElementById('image');
                          if (fileInput) fileInput.value = '';
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="image-preview-placeholder">
                      <i className="fas fa-image"></i>
                      <p>Vista previa de imagen</p>
                    </div>
                  )}
                </div>
                <div className="image-upload-wrapper">
                  <input 
                    type="file" 
                    name="image" 
                    id="image"
                    onChange={handleImageChange}
                    className="image-input-hidden"
                    accept="image/*"
                  />
                  <label htmlFor="image" className="image-upload-button">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>{imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}</span>
                  </label>
                  {imageFile && (
                    <div className="image-file-info">
                      <i className="fas fa-check-circle"></i>
                      <span>{imageFile.name}</span>
                    </div>
                  )}
                </div>
                {errors.image && <p className="form-error">{errors.image}</p>}
              </div>
            </div>

            {/* Campos del formulario - 6 columnas en tablet, 7 en desktop */}
            <div className="col-12 col-md-6 col-lg-7">
              <div className="form-fields-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name"
                    value={product.name} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className="form-input"
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="price" className="form-label">Precio</label>
                      <input 
                        type="number" 
                        name="price" 
                        id="price"
                        value={product.price} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className="form-input"
                      />
                      {errors.price && <p className="form-error">{errors.price}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="discount" className="form-label">Descuento</label>
                      <input 
                        type="number" 
                        name="discount" 
                        id="discount"
                        value={product.discount} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className="form-input"
                      />
                      {errors.discount && <p className="form-error">{errors.discount}</p>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">Categoría</label>
                      <select
                        name="category"
                        id="category"
                        value={product.category}
                        onChange={(e) => {
                          onChange(e);
                          // Limpiar subcategoría cuando cambia la categoría
                          if (product.subcategory) {
                            const subcategoryInput = document.getElementById('subcategory');
                            if (subcategoryInput) {
                              const subcategoryEvent = {
                                target: { name: 'subcategory', value: '' }
                              };
                              onChange(subcategoryEvent);
                            }
                          }
                        }}
                        onBlur={onBlur}
                        className="form-input form-select"
                      >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="form-error">{errors.category}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="subcategory" className="form-label">Subcategoría</label>
                      <select
                        name="subcategory"
                        id="subcategory"
                        value={product.subcategory || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        className="form-input form-select"
                        disabled={!product.category || subcategories.length === 0}
                      >
                        <option value="">{product.category ? 'Seleccione una subcategoría' : 'Primero seleccione una categoría'}</option>
                        {subcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                      {errors.subcategory && <p className="form-error">{errors.subcategory}</p>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="brand" className="form-label">Marca</label>
                      <select
                        name="brand"
                        id="brand"
                        value={product.brand}
                        onChange={onChange}
                        onBlur={onBlur}
                        className="form-input form-select"
                      >
                        <option value="">Seleccione una marca</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      {errors.brand && <p className="form-error">{errors.brand}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="section" className="form-label">Sección</label>
                      <select
                        name="section"
                        id="section"
                        value={product.section}
                        onChange={onChange}
                        onBlur={onBlur}
                        className="form-input form-select"
                      >
                        <option value="">Seleccione una sección</option>
                        {sections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                      {errors.section && <p className="form-error">{errors.section}</p>}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea 
                    name="description" 
                    id="description"
                    value={product.description} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className="form-input"
                    maxLength={500}
                  />
                  <div className="character-counter">
                    <span className={`character-count ${
                      !product.description || product.description.trim().length < 20 
                        ? 'character-count-error' 
                        : product.description.trim().length > 450 
                          ? 'character-count-warning' 
                          : 'character-count-valid'
                    }`}>
                      {product.description ? product.description.trim().length : 0}
                    </span>
                    <span className="character-limit">/ 500</span>
                    <span className="character-min">(mín. 20)</span>
                  </div>
                  {errors.description && <p className="form-error">{errors.description}</p>}
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="product-form-submit"
                >
                  <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
                  <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
