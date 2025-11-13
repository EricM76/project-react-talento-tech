import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/adminComponents/Sidebar/Sidebar'
import '../pages/Dashboard/Dashboard.css'

export const AdminLayout = () => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [openUserModal, setOpenUserModal] = useState(null)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  const isAuthRoute = location.pathname === '/admin'

  // Limpiar la función cuando cambiamos de ruta (excepto si vamos a usuarios)
  // Usar un pequeño delay para evitar actualizaciones durante el render
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname !== '/admin/usuarios') {
        setOpenUserModal(null)
      }
    }, 0)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (isAuthRoute) {
    return <Outlet />
  }

  return (
    <div className='admin-dashboard'>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onOpenUserModal={openUserModal} />
      <div className='admin-main'>
        <Outlet context={{ toggleSidebar, closeSidebar, setOpenUserModal }} />
      </div>
    </div>
  )
}
