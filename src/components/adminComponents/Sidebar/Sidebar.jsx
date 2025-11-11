import React from 'react'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', href: '#resumen' },
  { label: 'Usuarios', href: '#usuarios' },
  { label: 'Productos', href: '#productos' },
  { label: 'Ventas', href: '#ventas' },
  { label: 'Reportes', href: '#reportes' }
]

export const Sidebar = ({ isOpen, onClose, onNavigate, onOpenAddProduct }) => {
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
            <a
              href={item.href}
              className='sidebar-link'
              onClick={() => {
                onNavigate?.(item.href)
                onClose()
              }}
            >
              {item.label}
            </a>
            {item.label === 'Productos' && (
              <button
                type='button'
                className='sidebar-action-button'
                title='Agregar nuevo producto'
                aria-label='Agregar nuevo producto'
                onClick={() => {
                  onOpenAddProduct?.()
                  onClose()
                }}
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
