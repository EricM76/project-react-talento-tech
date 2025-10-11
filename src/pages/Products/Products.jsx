import React, { useEffect, useState } from "react";
import "./Products.css";
import { ProductCard } from "../../components/ProductCard";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);        
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container products-wrapper">
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">Todos los productos</h2>
        </div>
        {loading ? (
          <div className="alert alert-info">Cargando....</div>
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
