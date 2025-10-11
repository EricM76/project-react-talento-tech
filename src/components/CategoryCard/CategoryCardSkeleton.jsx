import React from 'react'
import './CategoryCard.css'

export const CategoryCardSkeleton = () => {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <section className="category-box">
        <div className="category-box_image placeholder-glow">
          <div className="placeholder" style={{width: '100%', height: '150px', backgroundColor: '#e9ecef'}}></div>
        </div>
        <article className="category-box_data">
          <h3 className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </h3>
          <p className="category-subcategories placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        </article>
      </section>
    </div>
  )
}

