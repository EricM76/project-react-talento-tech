import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Products } from './Products'

export const AdminProductsPage = () => {
  const { toggleSidebar } = useOutletContext() || {}

  const handleToggleSidebar = () => {
    if (typeof toggleSidebar === 'function') {
      toggleSidebar()
    }
  }

  return (
    <>
      <header className='admin-header'>
        <button type='button' className='sidebar-toggle' onClick={handleToggleSidebar}>
          ☰
        </button>
        <div>
          <h1 className='admin-title'>Productos</h1>
          <p className='admin-subtitle'>Gestiona y consulta el catálogo completo</p>
        </div>
      </header>

      <section className='dashboard-section standalone-products'>
        <Products />
      </section>
    </>
  )
}

