import React from 'react'
import './ProductCard.css'

export const ProductCardSkeleton = () => {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <section className="product-box">
        <div className="product-box_image placeholder-glow">
          <div className="placeholder" style={{width: '100%', height: '200px', backgroundColor: '#e9ecef'}}></div>
        </div>
        <article className="product-box_data">
          <h2 className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </h2>
          <p className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </p>
        </article>
      </section>
    </div>
  )
}

