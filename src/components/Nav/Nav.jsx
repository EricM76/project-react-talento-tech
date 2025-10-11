import React from 'react'
import './Nav.css'
import { Link, NavLink } from 'react-router-dom'

export const Nav = () => {
  return (
    <nav className="main-navbar">
    <ul className="left-navbar">
    <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/products" end>Todos los productos</NavLink>
      </li>
      <li>
        <NavLink to="/categories">Categorías</NavLink>
      </li>
      <li>
        <NavLink to="/sell">
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
        <Link to="/users/login">
          Ingresá <i className="fas fa-sign-in-alt"></i>
        </Link>
      </li>
    </ul>
  </nav>
  )
}
