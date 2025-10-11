import React from 'react'
import './Header.css'
import { Nav } from '../Nav'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-mercado-liebre.svg'

export const Header = () => {
  return (
    <header className="main-header">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-5 col-md-2">
          <Link to="/" className="main-header_home-link">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="col-7 col-md-6">
          <form
            className="search-form"
          >
            <input
              type="text"
              name="keywords"
              placeholder="Buscar productos, marcas y más"
              className="search-form_input"
            />
            <button type="submit" className="search-form_button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

       
      </div>

      <button className="btn-toggle-navbar">
        <i className="fas fa-bars"></i>
      </button>

      <Nav/>
    </div>
  </header>
    
  )
}
