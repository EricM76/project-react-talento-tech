import React, { useMemo, useState } from 'react'
import './Admin.css'
import { Sidebar } from '../../components/adminComponents/Sidebar/Sidebar'

const summaryData = [
  {
    id: 'usuarios',
    label: 'Usuarios Activos',
    value: 1245,
    trend: '+8% mensual',
    accent: 'usuarios'
  },
  {
    id: 'productos',
    label: 'Productos en Catálogo',
    value: 312,
    trend: '+12 nuevos',
    accent: 'productos'
  },
  {
    id: 'ventas',
    label: 'Ventas Mensuales',
    value: '$87,540',
    trend: '+15% respecto al mes pasado',
    accent: 'ventas'
  },
  {
    id: 'tickets',
    label: 'Tickets Abiertos',
    value: 23,
    trend: '-5 respecto a la semana pasada',
    accent: 'tickets'
  }
]

export const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const quickStats = useMemo(
    () => ({
      conversionRate: '3.8%',
      avgOrderValue: '$72.10',
      returningCustomers: '41%',
      pendingShipments: 18
    }),
    []
  )

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className='admin-dashboard'>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className='admin-main'>
        <header className='admin-header'>
          <button type='button' className='sidebar-toggle' onClick={toggleSidebar}>
            ☰
          </button>
          <div>
            <h1 className='admin-title'>Panel de Administración</h1>
            <p className='admin-subtitle'>Resumen general del desempeño de la tienda</p>
          </div>
        </header>

        <section className='dashboard-section' id='resumen'>
          <h2 className='section-title'>Resumen rápido</h2>
          <div className='summary-grid'>
            {summaryData.map((item) => (
              <article key={item.id} className={`summary-card summary-${item.accent}`}>
                <h3>{item.label}</h3>
                <p className='summary-value'>{item.value}</p>
                <span className='summary-trend'>{item.trend}</span>
              </article>
            ))}
          </div>
        </section>

        <section className='dashboard-section' id='usuarios'>
          <h2 className='section-title'>Actividad de usuarios</h2>
          <div className='panel'>
            <ul className='panel-list'>
              <li>
                <span>Nuevos registros (7d)</span>
                <strong>184</strong>
              </li>
              <li>
                <span>Usuarios con compras recurrentes</span>
                <strong>512</strong>
              </li>
              <li>
                <span>Carritos abandonados</span>
                <strong>86</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className='dashboard-section' id='productos'>
          <h2 className='section-title'>Estado de productos</h2>
          <div className='panel panel-grid'>
            <div>
              <span>En stock</span>
              <strong>248</strong>
            </div>
            <div>
              <span>Próximos a agotarse</span>
              <strong>34</strong>
            </div>
            <div>
              <span>Sin stock</span>
              <strong>12</strong>
            </div>
            <div>
              <span>Categorías destacadas</span>
              <strong>Moda, Hogar, Electrónicos</strong>
            </div>
          </div>
        </section>

        <section className='dashboard-section' id='ventas'>
          <h2 className='section-title'>Comercio y ventas</h2>
          <div className='panel'>
            <ul className='panel-list panel-list--two-columns'>
              <li>
                <span>Pedidos confirmados (24h)</span>
                <strong>132</strong>
              </li>
              <li>
                <span>Promedio ticket diario</span>
                <strong>{quickStats.avgOrderValue}</strong>
              </li>
              <li>
                <span>Tasa de conversión</span>
                <strong>{quickStats.conversionRate}</strong>
              </li>
              <li>
                <span>Clientes recurrentes</span>
                <strong>{quickStats.returningCustomers}</strong>
              </li>
              <li>
                <span>Envíos pendientes</span>
                <strong>{quickStats.pendingShipments}</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className='dashboard-section' id='reportes'>
          <h2 className='section-title'>Próximos pasos</h2>
          <div className='panel'>
            <p>
              Revisa semanalmente los indicadores clave para anticipar la demanda y ajustar campañas de marketing. Programa un
              envío de reportes automáticos a los líderes de cada área.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
