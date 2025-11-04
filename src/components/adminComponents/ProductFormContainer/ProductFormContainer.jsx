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
        } else if (value.trim().length < 10) {
          fieldError = 'El nombre debe tener al menos 10 caracteres';
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
        } else {
          const descLength = value.trim().length;
          if (descLength < 20) {
            fieldError = 'La descripción debe tener al menos 20 caracteres';
          } else if (descLength > 500) {
            fieldError = 'La descripción no puede tener más de 500 caracteres';
          }
        }
        break;
      case 'category':
        if (!value || value.trim() === '') {
          fieldError = 'La categoria es requerida';
        }
        break;
      case 'subcategory':
        if (!value || value.trim() === '') {
          fieldError = 'La subcategoría es requerida';
        }
        break;
      case 'brand':
        if (!value || value.trim() === '') {
          fieldError = 'La marca es requerida';
        }
        break;
      case 'section':
        if (!value || value.trim() === '') {
          fieldError = 'La sección es requerida';
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
    // Validar peso máximo de la imagen (5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        newErrors.image = 'La imagen no puede pesar más de 5MB';
        return newErrors;
      });
      return; // No actualizar el archivo si excede el tamaño
    }
    
    setFile(file);
    // Validar imagen en tiempo real: eliminar error si se sube una imagen válida
    if (file) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.image;
        return newErrors;
      });
    } else {
      // Agregar error si se elimina la imagen
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        newErrors.image = 'La imagen es requerida';
        return newErrors;
      });
    }
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
      const imageURL = await uploadToImgbb(file);
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
