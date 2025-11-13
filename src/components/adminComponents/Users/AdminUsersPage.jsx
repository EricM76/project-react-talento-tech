import React, { useRef, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { UsersContainer } from './UsersContainer'

export const AdminUsersPage = () => {
  const { toggleSidebar, setOpenUserModal } = useOutletContext() || {}
  const openModalRef = useRef(null)

  // Crear una función estable que solo se actualiza cuando la ref cambia
  const openModal = useCallback(() => {
    // Solo abrir si la ref está disponible
    if (openModalRef.current && typeof openModalRef.current === 'function') {
      openModalRef.current()
    }
  }, [])

  useEffect(() => {
    // Solo establecer la función cuando la ref esté disponible
    // Usar un pequeño delay para asegurar que UsersContainer haya establecido la ref
    // y que no se ejecute durante el render
    const timer = setTimeout(() => {
      if (setOpenUserModal && openModalRef.current) {
        setOpenUserModal(() => openModal)
      }
    }, 100)
    
    // Limpiar cuando el componente se desmonte
    return () => {
      clearTimeout(timer)
      if (setOpenUserModal) {
        setOpenUserModal(null)
      }
    }
  }, [setOpenUserModal, openModal])

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
          <h1 className='admin-title'>Usuarios</h1>
          <p className='admin-subtitle'>Gestiona usuarios del sistema</p>
        </div>
      </header>

      <section className='dashboard-section standalone-users'>
        <UsersContainer onOpenModalRef={openModalRef} />
      </section>
    </>
  )
}

