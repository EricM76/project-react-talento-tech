import React from 'react'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', href: '#resumen' },
  { label: 'Usuarios', href: '#usuarios' },
  { label: 'Productos', href: '#productos' },
  { label: 'Ventas', href: '#ventas' },
  { label: 'Reportes', href: '#reportes' }
]

export const Sidebar = ({ isOpen, onClose }) => {
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
          <a key={item.label} href={item.href} className='sidebar-link' onClick={onClose}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
