import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { ProductFormContainer } from '../ProductFormContainer'

export const ProductCreatePage = () => {
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
          <h1 className='admin-title'>Agregar nuevo producto</h1>
          <p className='admin-subtitle'>Completa el formulario para sumar un producto al catálogo</p>
        </div>
      </header>

      <section className='dashboard-section add-product-container'>
        <ProductFormContainer />
      </section>
    </>
  )
}

