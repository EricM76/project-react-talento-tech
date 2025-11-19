import React, { useContext, useState } from 'react'
import './LoginFormContainer.css'
import { LoginFormUI } from '../LoginFormUI'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { login } from '../../../services/auth'
import Swal from 'sweetalert2'

const validateCredentials = (credentials) => {
  const { username, password } = credentials
  const errors = {}

  if (!username.trim()) {
    errors.username = 'Ingresá tu nombre de usuario.'
  }

  if (!password.trim()) {
    errors.password = 'Ingresá tu contraseña.'
  } else if (password.trim().length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres.'
  }

  return errors
}

export const LoginFormContainer = () => {
  const { auth, setAuth, isInitializing } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    remember: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Si aún se está inicializando, no renderizar nada (evita parpadeo)
  // useLayoutEffect en AuthProvider asegura que esto sea muy rápido
  if (isInitializing) {
    return null
  }

  // Si hay auth, redirigir inmediatamente sin mostrar el formulario
  if (auth) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    setErrors((prev) => {
      if (!prev[name] && !prev.general) {
        return prev
      }

      const updatedErrors = { ...prev }
      delete updatedErrors[name]

      if (prev.general) {
        delete updatedErrors.general
      }

      return updatedErrors
    })
  }

  const handleBlur = () => {
    const validationErrors = validateCredentials(credentials)
    setErrors((prev) => {
      const updatedErrors = { ...prev }

      if (validationErrors.username) {
        updatedErrors.username = validationErrors.username
      } else {
        delete updatedErrors.username
      }

      if (validationErrors.password) {
        updatedErrors.password = validationErrors.password
      } else {
        delete updatedErrors.password
      }

      return updatedErrors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateCredentials(credentials)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const { user } = await login(credentials.username, credentials.password)
      
      // Guardar datos de autenticación usando setAuth del contexto
      // setAuth ahora maneja automáticamente localStorage/sessionStorage según remember
      setAuth({
        ...user,
        remember: credentials.remember
      })

      navigate('/admin/dashboard')
    } catch (error) {
      // Manejar errores específicos del servicio de autenticación
      const errorMessage = error?.message || 'Ocurrió un error al iniciar sesión. Intentalo nuevamente.'
      
      // Mostrar error con SweetAlert2 como toast en la esquina superior derecha
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-toast-large',
          title: 'swal2-toast-title-large',
          content: 'swal2-toast-content-large'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container login-wrapper">
      <LoginFormUI
        credentials={credentials}
        errors={errors}
        loading={loading}
        onChange={handleChange}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
