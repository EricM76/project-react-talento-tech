import React, { useState, useEffect } from 'react'
import './ItemCarousel.css'
import { toThousand } from '../../helpers'

export const ItemCarousel = ({ products = [], itemsPerView = 4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView)

  // Hook para detectar el tamaño de pantalla
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1200) {
        setResponsiveItemsPerView(5) // Large Desktop
      } else if (window.innerWidth >= 1024) {
        setResponsiveItemsPerView(4) // Desktop
      } else if (window.innerWidth >= 426) {
        setResponsiveItemsPerView(2) // Tablet
      } else {
        setResponsiveItemsPerView(1) // Mobile
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + responsiveItemsPerView >= products.length ? 0 : prevIndex + responsiveItemsPerView
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - responsiveItemsPerView < 0 
        ? Math.max(0, products.length - responsiveItemsPerView) 
        : prevIndex - responsiveItemsPerView
    )
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  if (products.length === 0) {
    return (
      <div className="item-carousel">
        <p>No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div className="item-carousel">
      <div className="carousel-header">
        <h2>Productos Relacionados</h2>
        {products.length > responsiveItemsPerView && (
          <div className="carousel-controls">
            <button 
              className="carousel-btn prev-btn" 
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="carousel-btn next-btn" 
              onClick={nextSlide}
              disabled={currentIndex + responsiveItemsPerView >= products.length}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
      
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ 
            transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`
          }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id || index} 
              className="carousel-item-wrapper"
            >
              <section className="carousel-item-card">
                <figure className="carousel-item-image">
                  <img 
                    src={product.image} 
                    alt="imagen de producto" 
                  />
                </figure>
                <article className="carousel-item-content">
                  <div className="carousel-item-price-row">
                    <h2 className="carousel-item-price">$ {toThousand(product.price)}</h2>
                    {product.discount > 0 ? (
                      <span className="carousel-item-discount">{product.discount}% OFF</span>
                    ) : null}
                  </div>
                  <p className="carousel-item-name">{product.name}</p>
                </article>
              </section>
            </div>
          ))}
        </div>
      </div>
      
      {products.length > responsiveItemsPerView && (
        <div className="carousel-indicators">
          {Array.from({ length: Math.ceil(products.length / responsiveItemsPerView) }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === Math.floor(currentIndex / responsiveItemsPerView) ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index * responsiveItemsPerView)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
