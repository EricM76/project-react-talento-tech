import React, { useEffect, useState } from "react";
import "./ItemDetailContainer.css";
import { useParams } from "react-router-dom";
import { ItemDetailContainerSkeleton } from "./ItemDetailContainerSkeleton";
import { ItemDetail } from "../ItemDetail";
import { getProductById, getProducts } from "../../services/products";

export const ItemDetailContainer = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const getData = async () => {
      try {
        const dataProduct = await getProductById(id);        
        setProduct(dataProduct);
        const dataProducts = await getProducts();
        
                                // Filtrar productos relacionados (misma marca o misma sección) evitando duplicados
        const currentProductId = String(dataProduct.id);
        const uniqueProductsMap = new Map(); // Usar Map para garantizar unicidad por ID
        
        dataProducts.forEach((product) => {
          const productId = String(product.id);
          
          // Saltar el producto actual
          if (productId === currentProductId) {
            return;
          }
          
          // Verificar si ya existe en el Map (evitar duplicados)
          if (uniqueProductsMap.has(productId)) {
            return;
          }
          
          // Verificar condiciones de coincidencia (usando section que es lo que tiene la API)
          const matchesBrand = product.brand && dataProduct.brand && product.brand === dataProduct.brand;
          const matchesCategory = product.category && dataProduct.category && product.category === dataProduct.category;
          
          // Agregar solo si cumple alguna condición
          if (matchesBrand || matchesCategory) {
            uniqueProductsMap.set(productId, product); // Guardar en el Map (garantiza unicidad)
          }
        });

        // Convertir Map a Array (ya garantiza que no hay duplicados)
        const relatedProducts = Array.from(uniqueProductsMap.values());

        console.log('Productos relacionados filtrados (sin duplicados):', relatedProducts.map(p => ({ id: p.id, name: p.name })));
        console.log('Total de productos relacionados:', relatedProducts.length);
        console.log('IDs únicos verificados:', Array.from(uniqueProductsMap.keys()));
        
        setProducts(relatedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
      }
    };
    
    getData();
  }, [id]);

  return (
    <div className="container products-wrapper">
      {loading ? (
        <ItemDetailContainerSkeleton />
      ) : (
        <ItemDetail product={product} products={products} />
      )}
    </div>
  );
};
