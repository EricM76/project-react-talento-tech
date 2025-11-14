import React, { useRef, useEffect, useCallback } from 'react'
import { useOutletContext, useLocation } from 'react-router-dom'
import { UsersContainer } from './UsersContainer'

export const AdminUsersPage = () => {
  const { toggleSidebar, setOpenUserModal } = useOutletContext() || {}
  const openModalRef = useRef(null)
  const location = useLocation()
  const shouldOpenModalRef = useRef(false)

  // Crear una función estable que solo se actualiza cuando la ref cambia
  const openModal = useCallback(() => {
    // Solo abrir si la ref está disponible
    if (openModalRef.current && typeof openModalRef.current === 'function') {
      openModalRef.current()
      shouldOpenModalRef.current = false
    } else {
      // Si la ref aún no está lista, marcar que debe abrirse cuando esté lista
      shouldOpenModalRef.current = true
    }
  }, [])

  useEffect(() => {
    // Verificar si hay una señal en sessionStorage para abrir el modal
    // Esto se establece cuando el usuario hace click en el botón de registro
    // desde otra página (en el Sidebar)
    const shouldOpen = sessionStorage.getItem('openUserModal') === 'true'
    if (shouldOpen) {
      shouldOpenModalRef.current = true
      sessionStorage.removeItem('openUserModal')
    }

    // Verificar si hay una señal para abrir el modal (viene del Sidebar)
    // Esto se establece cuando el usuario hace click en el botón de registro
    // desde otra página
    const checkAndOpenModal = () => {
      if (shouldOpenModalRef.current && openModalRef.current && typeof openModalRef.current === 'function') {
        openModalRef.current()
        shouldOpenModalRef.current = false
      }
    }

    // Solo establecer la función cuando la ref esté disponible
    // Usar un pequeño delay para asegurar que UsersContainer haya establecido la ref
    // y que no se ejecute durante el render
    const timer = setTimeout(() => {
      if (setOpenUserModal && openModalRef.current) {
        setOpenUserModal(() => openModal)
        // Verificar si debemos abrir el modal automáticamente
        checkAndOpenModal()
      }
    }, 100)
    
    // Limpiar cuando el componente se desmonte
    return () => {
      clearTimeout(timer)
      if (setOpenUserModal) {
        setOpenUserModal(null)
      }
    }
  }, [setOpenUserModal, openModal, location.pathname])

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

