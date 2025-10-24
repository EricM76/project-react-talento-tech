import React, { useEffect, useState } from "react";
import "./ItemDetailContainer.css";
import { useParams } from "react-router-dom";
import { ItemDetailContainerSkeleton } from "./ItemDetailContainerSkeleton";
import { ItemDetail } from "../ItemDetail";

export const ItemDetailContainer = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const [response] = await Promise.all([
          fetch(`/data/products.json`),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        const data = await response.json();
        setProduct(data.find((product) => product.id === +id));
        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
      }
    };
    
    fetchWithDelay();
  }, [id]);

  return (
    <div className="container products-wrapper">
      {loading ? (
        <ItemDetailContainerSkeleton />
      ) : (
        <ItemDetail product={product} />
      )}
    </div>
  );
};
