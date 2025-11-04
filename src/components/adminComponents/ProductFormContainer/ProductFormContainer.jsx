import React, { useState } from 'react'
import { uploadToImgbb } from '../../../services/uploadImage';
import { ProductFormUI } from '../ProductFormUI/ProductFormUI';
import { validateProduct } from '../../../utils/validateProduct';
import { createProduct } from '../../../services/products';

export const ProductFormContainer = () => {

  const [loading, setLoading] = useState(true);
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
    const [name, value] = e.target.value;
    setProduct({ ...product, [name]: value });
  }

  const handleImageUpload = (file) => {
    setFile(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData);

    const newErrors = validateProduct(...product, file);
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
        onSubmit={handleSubmit} 
        errors={errors} loading={loading} 
        onImageUpload={handleImageUpload} 
      />
    </div>
  )
}
