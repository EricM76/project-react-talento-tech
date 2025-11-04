import React, { useEffect, useState } from 'react'
import './ItemListContainer.css'
import { ItemList } from '../ItemList/ItemList';
import { ItemSkeleton } from '../Item/ItemSkeleton';
import { getProducts } from '../../services/products';

export const ItemListContainer = ({title = 'Todos los productos', filter}) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          console.log('Estructura del primer producto:', data[0]);
          if (filter) {
            const filtered = data.filter((product) => product.section === filter);
          }
        }
        
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    
    fetchWithDelay();
  }, [filter]);

  return (
    <div className="container products-wrapper">
        <h2 className="products-title">{title}</h2>
        <div className="container products-wrapper">
        <div className="row">
        {
          loading ? (
            <>
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
            </>
          ) : (
            <ItemList products={filter ? products.filter((product) => product?.section === filter) : products} loading={loading} />
          )
        }
        </div>
        </div>
  </div>
  )
}
