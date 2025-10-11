import React from 'react'
import './CategoryCard.css'
import { Link } from 'react-router-dom'

export const CategoryCard = ({ category }) => {
  const { id, name, icon, sub } = category

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <section className="category-box">
        <Link to={`/categories/${id}`}>
          <figure className="category-box_image">
            <img src={icon} alt={`icono de ${name}`} />
          </figure>
          <article className="category-box_data">
            <h3>{name}</h3>
            <p className="category-subcategories">
              {sub.length} subcategorías
            </p>
          </article>
        </Link>
      </section>
    </div>
  )
}

