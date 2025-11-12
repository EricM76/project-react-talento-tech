import './Dashboard.css'
import { useOutletContext } from 'react-router-dom'

const summaryData = [
  {
    id: 'usuarios',
    label: 'Usuarios Activos',
    value: 1245,
    trend: '+8% mensual',
    accent: 'usuarios',
    icon: 'fa-users'
  },
  {
    id: 'productos',
    label: 'Productos en Catálogo',
    value: 312,
    trend: '+12 nuevos',
    accent: 'productos',
    icon: 'fa-boxes-stacked'
  },
  {
    id: 'ventas',
    label: 'Ventas Mensuales',
    value: '$87,540',
    trend: '+15% respecto al mes pasado',
    accent: 'ventas',
    icon: 'fa-chart-line'
  }
]

export const Dashboard = () => {
  const { toggleSidebar } = useOutletContext() || {}
  const handleToggleSidebar = () => {
    if (typeof toggleSidebar === 'function') {
      toggleSidebar()
    }
  }

  const weeklyTrendPoints = '12,58 52,44 92,48 132,34 172,36 212,28 252,32'
  const categoryBars = [
    { label: 'Moda', value: 72, color: '#2563eb' },
    { label: 'Hogar', value: 64, color: '#f97316' },
    { label: 'Electrónica', value: 58, color: '#10b981' },
    { label: 'Belleza', value: 48, color: '#9333ea' }
  ]

  return (
    <>
      <header className='admin-header'>
        <button type='button' className='sidebar-toggle' onClick={handleToggleSidebar}>
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
              <div className='summary-headline'>
                <span className='summary-icon' aria-hidden='true'>
                  <i className={`fa-solid ${item.icon}`} />
                </span>
                <h3>{item.label}</h3>
              </div>
              <p className='summary-value'>{item.value}</p>
              <span className='summary-trend'>{item.trend}</span>
            </article>
          ))}
        </div>
      </section>

      <section className='dashboard-section' id='visualizaciones'>
        <h2 className='section-title'>Visualizaciones clave</h2>
        <div className='chart-grid'>
          <article className='chart-card'>
            <header className='chart-header'>
              <div>
                <h3>Rendimiento semanal</h3>
                <span className='chart-subtitle'>Pedidos confirmados</span>
              </div>
              <span className='chart-indicator up'>
                <i className='fa-solid fa-arrow-trend-up' aria-hidden='true' />
                12%
              </span>
            </header>
            <svg className='trend-chart' viewBox='0 0 264 120' role='img' aria-label='Tendencia semanal de pedidos'>
              <defs>
                <linearGradient id='trendGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                  <stop offset='0%' stopColor='rgba(37,99,235,0.6)' />
                  <stop offset='100%' stopColor='rgba(37,99,235,0.05)' />
                </linearGradient>
              </defs>
              <polygon
                className='trend-area'
                points={`${weeklyTrendPoints} 252,110 12,110`}
                fill='url(#trendGradient)'
              />
              <polyline className='trend-line' points={weeklyTrendPoints} />
              <g className='trend-axis'>
                <line x1='12' y1='110' x2='252' y2='110' />
                <line x1='12' y1='20' x2='12' y2='110' />
              </g>
            </svg>
            <footer className='chart-footer'>
              <span>Evolución de los últimos 7 días</span>
              <span className='chart-badge'>1.284 pedidos</span>
            </footer>
          </article>

          <article className='chart-card'>
            <header className='chart-header'>
              <div>
                <h3>Categorías destacadas</h3>
                <span className='chart-subtitle'>Participación en ventas</span>
              </div>
              <span className='chart-indicator steady'>
                <i className='fa-solid fa-layer-group' aria-hidden='true' />
                Top 4
              </span>
            </header>
            <div className='category-chart'>
              {categoryBars.map((item) => (
                <div key={item.label} className='category-bar'>
                  <div className='category-bar-graph'>
                    <div className='category-bar-fill' style={{ height: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                  <span className='category-bar-label'>{item.label}</span>
                  <span className='category-bar-value'>{item.value}%</span>
                </div>
              ))}
            </div>
            <footer className='chart-footer'>
              <span>Datos consolidados últimos 30 días</span>
              <span className='chart-badge neutral'>Moda lidera crecimiento</span>
            </footer>
          </article>
        </div>
      </section>

      <section className='dashboard-section' id='inventario'>
        <h2 className='section-title'>Estado de inventario</h2>
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
    </>
  )
}

