import React from 'react'
import './Nav.css'
import { Link, NavLink } from 'react-router-dom'

export const Nav = ({ isOpen, onClose, onCartToggle, cartQuantity }) => {
  const handleLinkClick = () => {
    // Cerrar el menú cuando se hace clic en un enlace (solo en mobile)
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  const handleCartClick = () => {
    if (onCartToggle) {
      onCartToggle()
    }
    // Cerrar el menú hamburguesa al abrir el carrito
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <nav className={`main-navbar ${isOpen ? 'show' : ''}`}>
      <button className="navbar-close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    <ul className="left-navbar">
    <li>
        <NavLink to="/" onClick={handleLinkClick}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/products" end onClick={handleLinkClick}>Todos los productos</NavLink>
      </li>
      <li>
        <NavLink to="/categories" onClick={handleLinkClick}>Categorías</NavLink>
      </li>
      <li>
        <NavLink to="/admin" onClick={handleLinkClick}>
          Vender
        </NavLink>
      </li>
    </ul>
    <ul className="right-navbar">
      <li>
        <span onClick={handleCartClick} className="nav-cart-link" style={{ cursor: 'pointer' }}>
          {cartQuantity > 0 && (
            <span className="nav-cart-badge">{cartQuantity}</span>
          )}
          <i className="fas fa-shopping-cart"></i> Mi carrito
        </span>
      </li>
    </ul>
  </nav>
  )
}
