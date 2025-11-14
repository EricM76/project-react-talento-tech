import React from 'react'
import './Users.css'

export const UsersUI = ({
  users,
  loading,
  error,
  processing,
  onToggleStatus,
  onResetPassword,
  onDeleteUser,
  showModal,
  userData,
  formErrors,
  submitting,
  onOpenModal,
  onCloseModal,
  onInputChange,
  onInputBlur,
  onSubmit
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
      <div className="users__header">
        <button
          type="button"
          className="users__register-button"
          onClick={onOpenModal}
          title="Registrar nuevo usuario"
          aria-label="Registrar nuevo usuario"
        >
          <i className="fa-solid fa-user-plus" aria-hidden="true" />
          <span>Registrar Usuario</span>
        </button>
      </div>
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
                      <button
                        type="button"
                        className="users__button users__button--danger"
                        onClick={() => onDeleteUser(user)}
                        disabled={processing}
                        title="Eliminar usuario"
                        aria-label="Eliminar usuario"
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" />
                        <span className="sr-only">Eliminar</span>
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
                <button
                  type="button"
                  className="users__button users__button--danger"
                  onClick={() => onDeleteUser(user)}
                  disabled={processing}
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
      </div>

      {/* Modal de registro de usuario */}
      {showModal && (
        <div className="users__modal-overlay" onClick={onCloseModal}>
          <div className="users__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="users__modal-header">
              <h3 className="users__modal-title">Registrar Nuevo Usuario</h3>
              <button
                type="button"
                className="users__modal-close"
                onClick={onCloseModal}
                aria-label="Cerrar modal"
              >
                <i className="fa-solid fa-times" aria-hidden="true" />
              </button>
            </div>

            <form className="users__modal-form" onSubmit={onSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={onInputChange}
                  onBlur={onInputBlur}
                  className={`form-input ${formErrors.name ? 'form-input-error' : ''}`}
                  placeholder="Ingresá el nombre"
                  autoComplete="given-name"
                />
                {formErrors.name && <p className="form-error">{formErrors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="surname" className="form-label">Apellido</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={userData.surname}
                  onChange={onInputChange}
                  onBlur={onInputBlur}
                  className={`form-input ${formErrors.surname ? 'form-input-error' : ''}`}
                  placeholder="Ingresá el apellido"
                  autoComplete="family-name"
                />
                {formErrors.surname && <p className="form-error">{formErrors.surname}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={onInputChange}
                  onBlur={onInputBlur}
                  className={`form-input ${formErrors.email ? 'form-input-error' : ''}`}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                />
                {formErrors.email && <p className="form-error">{formErrors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={onInputChange}
                  onBlur={onInputBlur}
                  className={`form-input ${formErrors.password ? 'form-input-error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {formErrors.password && <p className="form-error">{formErrors.password}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">Rol</label>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={onInputChange}
                  onBlur={onInputBlur}
                  className={`form-input ${formErrors.role ? 'form-input-error' : ''}`}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                {formErrors.role && <p className="form-error">{formErrors.role}</p>}
              </div>

              {formErrors.general && (
                <p className="form-error form-error-general">{formErrors.general}</p>
              )}

              <div className="users__modal-actions">
                <button
                  type="button"
                  className="users__modal-button users__modal-button--cancel"
                  onClick={onCloseModal}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="users__modal-button users__modal-button--submit"
                  disabled={submitting}
                >
                  <i className={submitting ? 'fas fa-spinner fa-spin' : 'fas fa-user-plus'}></i>
                  <span>{submitting ? 'Creando...' : 'Crear Usuario'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

