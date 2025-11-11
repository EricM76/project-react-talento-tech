import React, { useContext, useState } from 'react'
import './LoginFormContainer.css'
import { LoginFormUI } from '../LoginFormUI'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateCredentials = (credentials) => {
  const { email, password } = credentials
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Ingresá tu correo electrónico.'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Ingresá un correo electrónico válido.'
  }

  if (!password.trim()) {
    errors.password = 'Ingresá tu contraseña.'
  } else if (password.trim().length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  }

  return errors
}

export const LoginFormContainer = () => {
  const { setAuth } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

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

      if (validationErrors.email) {
        updatedErrors.email = validationErrors.email
      } else {
        delete updatedErrors.email
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
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAuth({
        email: credentials.email,
        remember: credentials.remember
      })
      navigate('/admin/dashboard')
    } catch (error) {
      setErrors({
        general:
          error?.message ?? 'Ocurrió un error al iniciar sesión. Intentalo nuevamente.'
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
