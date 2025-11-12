import React, { useEffect, useState } from "react";
import "./Categories.css";
import { CategoryCard, CategoryCardSkeleton } from "../../components/CategoryCard";
import { getCategories } from "../../services/categories";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos un delay de 2 segundos para ver el efecto de carga
    const fetchWithDelay = async () => {
      try {
        const [data] = await Promise.all([
          getCategories(),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
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
