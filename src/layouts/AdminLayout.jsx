import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/adminComponents/Sidebar/Sidebar'
import '../pages/Dashboard/Dashboard.css'

export const AdminLayout = () => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  const isAuthRoute = location.pathname === '/admin'

  if (isAuthRoute) {
    return <Outlet />
  }

  return (
    <div className='admin-dashboard'>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className='admin-main'>
        <Outlet context={{ toggleSidebar, closeSidebar }} />
      </div>
    </div>
  )
}
