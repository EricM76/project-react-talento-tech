import React from 'react'
import './ProductDetail.css'

export const ProductDetailSkeleton = () => {
  return (
    <>
      <div className="row">
        <div className="col-12 placeholder-glow">
          <h2 className="products-title">
            <span className="placeholder col-6"></span>
          </h2>
        </div>
      </div>
      <div className="product-detail">
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="placeholder-glow">
              <div 
                className="placeholder product-detail-img" 
                style={{width: '100%', height: '400px', backgroundColor: '#e9ecef'}}
              ></div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <article className="product-detail-info">
              <h2 className="product-detail-title placeholder-glow">
                <span className="placeholder col-10"></span>
              </h2>
              <p className="product-detail-price placeholder-glow">
                <span className="placeholder col-6"></span>
              </p>
              <p className="product-detail-description placeholder-glow">
                <span className="placeholder col-12"></span>
                <span className="placeholder col-11"></span>
                <span className="placeholder col-12"></span>
                <span className="placeholder col-9"></span>
              </p>
              <div className="placeholder-glow">
                <span className="placeholder col-12" style={{height: '38px'}}></span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  )
}

