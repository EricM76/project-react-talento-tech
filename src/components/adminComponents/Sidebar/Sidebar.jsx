import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', to: '/admin/dashboard' },
  { label: 'Productos', to: '/admin/productos' },
  { label: 'Usuarios', to: '/admin/usuarios' }
]

export const Sidebar = ({ isOpen, onClose, onOpenUserModal }) => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleAddProduct = () => {
    navigate('/admin/productos/nuevo')
    onClose?.()
  }

  const handleAddUser = () => {
    // Solo abrir el modal si estamos en la página de usuarios y la función está disponible
    if (window.location.pathname === '/admin/usuarios') {
      if (onOpenUserModal && typeof onOpenUserModal === 'function') {
        onOpenUserModal()
      }
      onClose?.()
    } else {
      // Si no estamos en la página de usuarios, solo navegar (sin abrir el modal automáticamente)
      // El usuario puede hacer clic en el botón de nuevo cuando esté en la página
      navigate('/admin/usuarios')
      onClose?.()
    }
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
              onClick={(e) => {
                e.stopPropagation()
                onClose?.()
              }}
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
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleAddProduct()
                }}
              >
                <i className='fa-solid fa-plus' aria-hidden='true' />
              </button>
            )}
            {item.label === 'Usuarios' && (
              <button
                type='button'
                className='sidebar-action-button'
                title='Registrar nuevo usuario'
                aria-label='Registrar nuevo usuario'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleAddUser()
                }}
              >
                <i className='fa-solid fa-user-plus' aria-hidden='true' />
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
