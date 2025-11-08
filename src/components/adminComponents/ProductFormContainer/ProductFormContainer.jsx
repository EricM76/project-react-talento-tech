import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { uploadToImgbb } from '../../../services/uploadImage';
import { ProductFormUI } from '../ProductFormUI/ProductFormUI';
import { validateProduct } from '../../../utils/validateProduct';
import { createProduct } from '../../../services/products';

export const ProductFormContainer = () => {

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
    const productWithField = { ...product, [name]: value };
    const validationResult = validateProduct(productWithField, file, false);
    const fieldError = validationResult[name] ?? null;

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  }

  const handleImageUpload = (file) => {
    setFile(file);
    const validationResult = validateProduct(product, file, true);
    const imageError = validationResult.image ?? null;

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (imageError) {
        newErrors.image = imageError;
      } else {
        delete newErrors.image;
      }
      return newErrors;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const createdProduct = await createProduct(newProduct);

      if (createdProduct?.id) {
        navigate(`/products/${createdProduct.id}`);
      }
    
    } catch (error) {
      setErrors({ error: error.message || 'Error al guardar el producto' });
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
