import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CarouselItems.css'
import { toThousand } from '../../helpers'

export const CarouselItems = ({ products = [], itemsPerView = 4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Crear arrays duplicados para el carousel infinito
  const duplicatedProducts = [...products, ...products, ...products]

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

  // Inicializar en la segunda copia (centro)
  useEffect(() => {
    setCurrentIndex(products.length)
  }, [products.length])

  // Auto-play: mover automáticamente cada 3 segundos
  useEffect(() => {
    if (products.length <= responsiveItemsPerView || isPaused) {
      return // No auto-play si hay pocos productos o está pausado
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + responsiveItemsPerView
        
        // Si llegamos al final de la segunda copia
        if (newIndex >= products.length * 2) {
          // Saltar sin transición al inicio de la segunda copia
          setTimeout(() => {
            setIsTransitioning(false)
            setCurrentIndex(products.length)
            setTimeout(() => setIsTransitioning(true), 50)
          }, 300)
        }
        
        return newIndex
      })
    }, 3000) // Cambiar cada 3 segundos

    return () => clearInterval(interval)
  }, [products.length, responsiveItemsPerView, isPaused])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + responsiveItemsPerView
      
      // Si llegamos al final de la segunda copia
      if (newIndex >= products.length * 2) {
        // Saltar sin transición al inicio de la segunda copia
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentIndex(products.length)
          setTimeout(() => setIsTransitioning(true), 50)
        }, 300)
      }
      
      return newIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - responsiveItemsPerView
      
      // Si llegamos antes del inicio de la segunda copia
      if (newIndex < products.length) {
        // Saltar sin transición al final de la segunda copia
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentIndex(products.length * 2 - responsiveItemsPerView)
          setTimeout(() => setIsTransitioning(true), 50)
        }, 300)
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
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="carousel-container">
          <div 
            className="carousel-track" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`,
              transition: isTransitioning ? 'transform 0.3s ease' : 'none'
            }}
          >
            {duplicatedProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
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
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      {products.length > responsiveItemsPerView && (
        <div className="carousel-navigation">
          <div className="carousel-indicators">
            {Array.from({ length: Math.ceil(products.length / responsiveItemsPerView) }).map((_, index) => {
              const adjustedIndex = currentIndex >= products.length 
                ? currentIndex - products.length 
                : currentIndex
              return (
                <button
                  key={index}
                  className={`indicator ${index === Math.floor(adjustedIndex / responsiveItemsPerView) ? 'active' : ''}`}
                  onClick={() => setCurrentIndex((index * responsiveItemsPerView) + products.length)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
