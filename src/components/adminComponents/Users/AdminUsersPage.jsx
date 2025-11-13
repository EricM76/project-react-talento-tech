import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { UsersContainer } from './UsersContainer'

export const AdminUsersPage = () => {
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
          <h1 className='admin-title'>Usuarios</h1>
          <p className='admin-subtitle'>Gestiona usuarios del sistema</p>
        </div>
      </header>

      <section className='dashboard-section standalone-users'>
        <UsersContainer />
      </section>
    </>
  )
}

