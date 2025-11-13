import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', to: '/admin/dashboard' },
  { label: 'Productos', to: '/admin/productos' }
]

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleAddProduct = () => {
    navigate('/admin/productos/nuevo')
    onClose?.()
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
    onClose?.()
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className='sidebar-header'>
        <span className='sidebar-title'>TalentoTech Admin</span>
        <button
          type='button'
          className='sidebar-close'
          aria-label='Cerrar menú'
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <div key={item.label} className='sidebar-item'>
            <NavLink
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
              onClick={onClose}
              end
            >
              {item.label}
            </NavLink>
            {item.label === 'Productos' && (
              <button
                type='button'
                className='sidebar-action-button'
                title='Agregar nuevo producto'
                aria-label='Agregar nuevo producto'
                onClick={handleAddProduct}
              >
                <i className='fa-solid fa-plus' aria-hidden='true' />
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className='sidebar-footer'>
        <button
          type='button'
          className='sidebar-logout-button'
          onClick={handleLogout}
          title='Cerrar sesión'
          aria-label='Cerrar sesión'
        >
          <i className='fa-solid fa-sign-out-alt' aria-hidden='true' />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
