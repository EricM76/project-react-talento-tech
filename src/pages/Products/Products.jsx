import React, { useEffect, useState } from "react";
import "./Products.css";
import { ProductCard, ProductCardSkeleton } from "../../components/ProductCard";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const [response] = await Promise.all([
          fetch("/data/products.json"),
          new Promise(resolve => setTimeout(resolve, 2000))
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
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">Todos los productos</h2>
        </div>
        {loading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          products.map((product, index) => (
            <ProductCard
              product={product}
              key={product.id + index}
            />
          ))
        )}
      </div>
    </div>
  );
};
