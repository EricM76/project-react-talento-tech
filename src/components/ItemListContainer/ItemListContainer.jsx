import React, { useEffect, useState } from 'react'
import './ItemListContainer.css'
import { ItemList } from '../ItemList/ItemList';
import { ItemSkeleton } from '../Item/ItemSkeleton';

export const ItemListContainer = ({title = 'Todos los productos', filter}) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const [response] = await Promise.all([
          fetch("/data/products.json"),
          new Promise(resolve => setTimeout(resolve, 1000))
        ]);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    
    fetchWithDelay();
  }, []);

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
            <ItemList products={filter ? products.filter((product) => product.category === filter) : products} loading={loading} />
          )
        }
        </div>
        </div>
  </div>
  )
}
