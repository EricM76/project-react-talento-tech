import React, { useEffect, useState } from "react";
import "./Categories.css";
import { CategoryCard } from "../../components/CategoryCard";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/categories.json")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container categories-wrapper">
      <div className="row">
        <div className="col-12">
          <h2 className="categories-title">Todas las categorías</h2>
        </div>
        {loading ? (
          <div className="alert alert-info">Cargando....</div>
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
