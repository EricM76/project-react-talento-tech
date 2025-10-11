import React, { useEffect, useState } from "react";
import "./Categories.css";
import { CategoryCard, CategoryCardSkeleton } from "../../components/CategoryCard";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const [response] = await Promise.all([
          fetch("/data/categories.json"),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading categories:", error);
        setLoading(false);
      }
    };
    
    fetchWithDelay();
  }, []);

  return (
    <div className="container categories-wrapper">
      <div className="row">
        <div className="col-12">
          <h2 className="categories-title">Todas las categorías</h2>
        </div>
        {loading ? (
          <>
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
          </>
        ) : (
          categories.map((category, index) => (
            <CategoryCard
              category={category}
              key={category.id + index}
            />
          ))
        )}
      </div>
    </div>
  );
};
