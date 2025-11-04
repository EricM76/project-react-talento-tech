import React, { useState } from 'react'
import { uploadToImgbb } from '../../../services/uploadImage';
import { ProductFormUI } from '../ProductFormUI/ProductFormUI';
import { validateProduct } from '../../../utils/validateProduct';
import { createProduct } from '../../../services/products';

export const ProductFormContainer = () => {

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const [product, setProduct] = useState({
    name: '',
    price: 0,
    discount: 0,
    description: '',
    category: '',
    subcategory: '',
    section: '',
    brand: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validar solo el campo que perdió el foco
    let fieldError = null;
    
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          fieldError = 'El nombre es requerido';
        }
        break;
      case 'price':
        if (!value || parseFloat(value) <= 0) {
          fieldError = 'El precio es requerido';
        }
        break;
      case 'discount':
        if (!value || parseFloat(value) < 0 || parseFloat(value) > 100) {
          fieldError = 'El descuento es requerido';
        }
        break;
      case 'description':
        if (!value || value.trim() === '') {
          fieldError = 'La descripción es requerida';
        }
        break;
      case 'category':
        if (!value || value.trim() === '') {
          fieldError = 'La categoria es requerida';
        }
        break;
      default:
        break;
    }
    
    // Actualizar el estado de errores: agregar o eliminar según corresponda
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (fieldError) {
        // Si hay error, agregarlo o actualizarlo
        newErrors[name] = fieldError;
      } else {
        // Si el campo es válido, eliminar el error si existe
        delete newErrors[name];
      }
      return newErrors;
    });
  }

  const handleImageUpload = (file) => {
    setFile(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData);

    const newErrors = validateProduct(product, file);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    
    try {
      const imageURL =uploadToImgbb(file[0]);
      const newProduct = { ...product, 
        price: product.price * (1 - product.discount / 100),
        image: imageURL 
      };

      await createProduct(newProduct);
    
    } catch (error) {
      setErrors({ error: 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
      
  }


  return (
    <div className="container products-wrapper">
      <ProductFormUI 
        product={product} 
        onChange={handleChange} 
        onBlur={handleBlur}
        onSubmit={handleSubmit} 
        errors={errors}
        onImageUpload={handleImageUpload} 
        loading={loading}
      />
    </div>
  )
}
