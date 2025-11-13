import React from 'react'
import './Users.css'

export const UsersUI = ({
  users,
  loading,
  error,
  processing,
  onToggleStatus,
  onResetPassword
}) => {

  const getRoleLabel = (role) => {
    return role === 'admin' ? 'Administrador' : 'Usuario'
  }

  const getStatusBadge = (active) => {
    return (
      <span className={`users__status-badge ${active ? 'users__status-badge--active' : 'users__status-badge--inactive'}`}>
        {active ? 'Habilitado' : 'Inhabilitado'}
      </span>
    )
  }

  return (
    <section className="users__container">
      <div className="users__table-wrapper">
        <table className="users__table">
          <thead>
            <tr>
              <th>Nombre y Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="users__actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="users__status">
                  Cargando usuarios...
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={5} className="users__status users__status--error">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && users.length === 0 && (
              <tr>
                <td colSpan={5} className="users__status">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              users.map((user) => (
                <tr key={user.id}>
                  <td className="users__name">
                    {user.name} {user.surname}
                  </td>
                  <td className="users__email">{user.email}</td>
                  <td className="users__role-cell">
                    <span className="users__role">{getRoleLabel(user.role)}</span>
                  </td>
                  <td className="users__status-cell">
                    {getStatusBadge(user.active)}
                  </td>
                  <td className="users__actions-cell">
                    <div className="users__actions">
                      <button
                        type="button"
                        className={`users__button ${user.active ? 'users__button--warning' : 'users__button--success'}`}
                        onClick={() => onToggleStatus(user)}
                        disabled={processing}
                        title={user.active ? 'Deshabilitar usuario' : 'Habilitar usuario'}
                        aria-label={user.active ? 'Deshabilitar usuario' : 'Habilitar usuario'}
                      >
                        <i className={`fa-solid ${user.active ? 'fa-ban' : 'fa-check-circle'}`} aria-hidden="true" />
                        <span className="sr-only">
                          {user.active ? 'Deshabilitar' : 'Habilitar'}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="users__button users__button--primary"
                        onClick={() => onResetPassword(user)}
                        disabled={processing}
                        title="Blanquear contraseña"
                        aria-label="Blanquear contraseña"
                      >
                        <i className="fa-solid fa-key" aria-hidden="true" />
                        <span className="sr-only">Blanquear contraseña</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil con cards */}
      <div className="users__cards">
        {loading && <div className="users__card-status">Cargando usuarios...</div>}
        {error && !loading && (
          <div className="users__card-status users__card-status--error">{error}</div>
        )}
        {!loading && !error && users.length === 0 && (
          <div className="users__card-status">No hay usuarios para mostrar.</div>
        )}

        {!loading &&
          !error &&
          users.map((user) => (
            <article key={user.id} className="users__card">
              <header className="users__card-header">
                <div>
                  <h3 className="users__card-title">
                    {user.name} {user.surname}
                  </h3>
                  <p className="users__card-email">{user.email}</p>
                </div>
                <div className="users__card-status-badge">
                  {getStatusBadge(user.active)}
                </div>
              </header>

              <div className="users__card-info">
                <div>
                  <span>Rol</span>
                  <strong>{getRoleLabel(user.role)}</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong>{user.active ? 'Habilitado' : 'Inhabilitado'}</strong>
                </div>
              </div>

              <div className="users__card-actions">
                <button
                  type="button"
                  className={`users__button ${user.active ? 'users__button--warning' : 'users__button--success'}`}
                  onClick={() => onToggleStatus(user)}
                  disabled={processing}
                >
                  <i className={`fa-solid ${user.active ? 'fa-ban' : 'fa-check-circle'}`} aria-hidden="true" />
                  <span>{user.active ? 'Deshabilitar' : 'Habilitar'}</span>
                </button>
                <button
                  type="button"
                  className="users__button users__button--primary"
                  onClick={() => onResetPassword(user)}
                  disabled={processing}
                >
                  <i className="fa-solid fa-key" aria-hidden="true" />
                  <span>Blanquear contraseña</span>
                </button>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}

