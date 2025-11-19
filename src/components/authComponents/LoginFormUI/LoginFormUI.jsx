import React from 'react'
import { Link } from 'react-router-dom'
import './LoginFormUI.css'

export const LoginFormUI = ({
  credentials,
  errors,
  loading,
  onChange,
  onBlur,
  onSubmit
}) => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <h1 className="login-form-title">Iniciar sesión</h1>
        </div>
      </div>

      <div className="login-form-container">
        <form className="login-form" onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={onChange}
              onBlur={onBlur}
              className={`form-input ${errors.username ? 'form-input-error' : ''}`}
              placeholder="Nombre de usuario"
              autoComplete="username"
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              onBlur={onBlur}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={credentials.remember}
                onChange={onChange}
              />
              <span>Recordarme</span>
            </label>
            <a href="/forgot-password" className="forgot-password-link">
              Olvidé mi contraseña
            </a>
          </div>

          {errors.general && <p className="form-error form-error-general">{errors.general}</p>}

          <button
            type="submit"
            className="login-form-submit"
            disabled={loading}
          >
            <i className={loading ? 'fas fa-spinner fa-spin' : 'fas fa-sign-in-alt'}></i>
            <span>{loading ? 'Ingresando...' : 'Ingresar'}</span>
          </button>
        </form>
      </div>

      <div className="row back-home-row">
        <div className="col-12">
          <Link to="/" className="back-home-link">
            <i className="fas fa-arrow-left"></i> Volver al Home
          </Link>
        </div>
      </div>
    </>
  )
}
