import React, { useState, useEffect } from "react";
import "./Home.css";
import { ProductCard } from "../../components/ProductCard";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="container products-wrapper">
        <div className="row">
          <div className="col-12">
            <h2 className="products-title">Últimos agregados</h2>
          </div>
          {loading ? (
            <div className="alert alert-info">Cargando....</div>
          ) : (
            products
              .filter((product) => product.category === "visited")
              .map((product, index) => (
                <ProductCard product={product} key={product.id + index} />
              ))
          )}
        </div>
      </div>
      <div className="container products-wrapper">
        <div className="row">
          <div className="col-12">
            <h2 className="products-title">Ofertas</h2>
          </div>
          {loading ? (
            <div className="alert alert-info">Cargando....</div>
          ) : (
            products
              .filter((product) => product.category === "in-sale")
              .map((product, index) => (
                <ProductCard product={product} key={product.id + index} />
              ))
          )}
        </div>
      </div>
    </>
  );
};
