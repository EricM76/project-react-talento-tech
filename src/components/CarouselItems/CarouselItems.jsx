import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CarouselItems.css'
import { toThousand } from '../../utils'

export const CarouselItems = ({ products = [], itemsPerView = 4 }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView)
  const [isPaused, setIsPaused] = useState(false)

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

  // Calcular el índice máximo basado en productos y items por vista
  const maxIndex = Math.max(0, products.length - responsiveItemsPerView)

  // Reiniciar índice cuando cambien los productos
  useEffect(() => {
    setCurrentIndex(0)
  }, [products.length])

  // Auto-play: mover automáticamente cada 3 segundos
  useEffect(() => {
    if (products.length <= responsiveItemsPerView || isPaused) {
      return // No auto-play si hay pocos productos o está pausado
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + responsiveItemsPerView

        // Si llegamos al final, volver al inicio
        if (newIndex > maxIndex) {
          return 0
        }

        return newIndex
      })
    }, 3000) // Cambiar cada 3 segundos

    return () => clearInterval(interval)
  }, [products.length, responsiveItemsPerView, isPaused, maxIndex])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + responsiveItemsPerView

      // Si llegamos al final, quedarse en el último índice válido
      if (newIndex > maxIndex) {
        return maxIndex
      }

      return newIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - responsiveItemsPerView

      // Si llegamos antes del inicio, quedarse en 0
      if (newIndex < 0) {
        return 0
      }

      return newIndex
    })
  }

  if (products.length === 0) {
    return (
      <div className="item-carousel">
        <p>No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div 
      className="item-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-header">
        <h2>Productos Relacionados</h2>
      </div>
      
      <div className="carousel-container-wrapper">
                <button
          className="carousel-btn carousel-btn-lateral prev-btn"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
                <div className="carousel-container">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`,
              transition: 'transform 0.3s ease'
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="carousel-item-wrapper"
              >
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                </Link>
              </div>
            ))}
          </div>
        </div>
        
                <button
          className="carousel-btn carousel-btn-lateral next-btn"
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          style={{ opacity: currentIndex >= maxIndex ? 0.5 : 1, cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer' }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
            {products.length > responsiveItemsPerView && (
        <div className="carousel-navigation">
          <div className="carousel-indicators">
            {Array.from({ length: Math.ceil(products.length / responsiveItemsPerView) }).map((_, index) => {
              const slideIndex = index * responsiveItemsPerView
              return (
                <button
                  key={index}
                  className={`indicator ${Math.floor(currentIndex / responsiveItemsPerView) === index ? 'active' : ''}`}
                  onClick={() => {
                    const targetIndex = Math.min(slideIndex, maxIndex)
                    setCurrentIndex(targetIndex)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
