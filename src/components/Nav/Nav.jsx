import React from 'react'
import './Nav.css'
import { Link, NavLink } from 'react-router-dom'

export const Nav = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    // Cerrar el menú cuando se hace clic en un enlace (solo en mobile)
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <nav className={`main-navbar ${isOpen ? 'show' : ''}`}>
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
        <NavLink to="/sell" onClick={handleLinkClick}>
          Vender
        </NavLink>
      </li>
    </ul>
    <ul className="right-navbar">
      <li>
        <span id="link-register">
          Registrate <i className="fas fa-address-card"></i>
        </span>
      </li>
      <li>
        <Link to="/users/login" onClick={handleLinkClick}>
          Ingresá <i className="fas fa-sign-in-alt"></i>
        </Link>
      </li>
    </ul>
  </nav>
  )
}
