import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', to: '/admin/dashboard' },
  { label: 'Productos', to: '/admin/productos' }
]

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleAddProduct = () => {
    navigate('/admin/productos/nuevo')
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
    </aside>
  )
}
