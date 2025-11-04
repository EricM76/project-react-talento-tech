import React, { useState } from 'react'
import { uploadToImgbb } from '../../../services/uploadImage';

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
    section: '',
    brand: '',
  });


  const handleChange = (e) => {
    const [name, value] = e.target.value;
    setProduct({ ...product, [name]: value });
  }

  handleSubmit = async (e) => {
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
    <ProductFormUI product={product} handleChange={handleChange} handleSubmit={handleSubmit} />
  )
}
