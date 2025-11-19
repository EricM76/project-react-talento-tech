import React, { useEffect, useState, useCallback } from 'react'
import { getUsers, updateUserStatus, resetUserPassword, createUser, deleteUser } from '../../../services/users'
import { UsersUI } from './UsersUI'
import Swal from 'sweetalert2'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Función para normalizar texto: minúsculas, sin acentos, ñ -> n
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'n')
    .trim()
}

const validateUserData = (userData) => {
  const { name, surname, username, email, password, role } = userData
  const errors = {}

  if (!name || !name.trim()) {
    errors.name = 'El nombre es requerido'
  }

  if (!surname || !surname.trim()) {
    errors.surname = 'El apellido es requerido'
  }

  if (!username || !username.trim()) {
    errors.username = 'El nombre de usuario es requerido'
  }

  if (!email || !email.trim()) {
    errors.email = 'El correo electrónico es requerido'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Ingresá un correo electrónico válido'
  }

  if (!password || !password.trim()) {
    errors.password = 'La contraseña es requerida'
  } else if (password.trim().length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres'
  }

  if (!role) {
    errors.role = 'El rol es requerido'
  }

  return errors
}

export const UsersContainer = ({ onOpenModalRef }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error('Error al obtener usuarios:', err)
        setError('No se pudieron cargar los usuarios. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Limpiar error de username cuando se genera automáticamente y tiene valor
  useEffect(() => {
    if (userData.username && userData.username.trim() && formErrors.username) {
      setFormErrors((prev) => {
        const updated = { ...prev }
        delete updated.username
        return updated
      })
    }
  }, [userData.username])

  const handleOpenModal = useCallback(() => {
    setShowModal(true)
    setUserData({
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      role: 'user'
    })
    setFormErrors({})
  }, [])

  // Exponer la función para abrir el modal a través de la ref
  // Usar un pequeño delay para evitar actualizaciones durante el render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onOpenModalRef) {
        onOpenModalRef.current = handleOpenModal
      }
    }, 0)
    
    // Limpiar la ref cuando el componente se desmonte
    return () => {
      clearTimeout(timer)
      if (onOpenModalRef) {
        onOpenModalRef.current = null
      }
    }
  }, [onOpenModalRef, handleOpenModal])

  const handleToggleStatus = async (user) => {
    const newStatus = !user.active
    const action = newStatus ? 'habilitar' : 'deshabilitar'
    
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `<p style="font-size: 18px;">¿Deseas ${action} al usuario "<strong>${user.name} ${user.surname}</strong>"?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      width: '600px',
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-large',
        cancelButton: 'swal2-cancel-large'
      },
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        setProcessing(true)
        setError(null)
        const updatedUser = await updateUserStatus(user.id, newStatus)
        
        // Actualizar la lista local de usuarios
        setUsers((prevUsers) =>
          prevUsers.map((item) => (item.id === user.id ? updatedUser : item))
        )

        Swal.fire({
          icon: 'success',
          title: `Usuario ${newStatus ? 'habilitado' : 'deshabilitado'}`,
          text: `El usuario ha sido ${newStatus ? 'habilitado' : 'deshabilitado'} correctamente.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
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
      } catch (err) {
        console.error('Error al actualizar el estado del usuario:', err)
        const errorMessage = err?.message || 'No se pudo actualizar el estado del usuario. Intenta nuevamente.'
        
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
        setProcessing(false)
      }
    }
  }

  const handleResetPassword = async (user) => {
    const result = await Swal.fire({
      title: '¿Blanquear contraseña?',
      html: `<p style="font-size: 18px;">¿Deseas blanquear la contraseña del usuario "<strong>${user.name} ${user.surname}</strong>"?</p><p style="font-size: 14px; color: #6b7280; margin-top: 10px;">La contraseña se establecerá en "1234".</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, blanquear',
      cancelButtonText: 'Cancelar',
      width: '600px',
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-large',
        cancelButton: 'swal2-cancel-large'
      },
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        setProcessing(true)
        setError(null)
        await resetUserPassword(user.id)
        
        Swal.fire({
          icon: 'success',
          title: 'Contraseña blanqueada',
          html: `La contraseña del usuario "<strong>${user.name} ${user.surname}</strong>" ha sido blanqueada correctamente. Nueva contraseña: <strong>1234</strong>`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
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
      } catch (err) {
        console.error('Error al blanquear la contraseña:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo blanquear la contraseña. Intenta nuevamente.',
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
        setProcessing(false)
      }
    }
  }

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      html: `<p style="font-size: 18px;">¿Estás seguro de que deseas eliminar al usuario "<strong>${user.name} ${user.surname}</strong>"?</p><p style="font-size: 14px; color: #dc2626; margin-top: 10px; font-weight: 600;">Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '600px',
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-large',
        cancelButton: 'swal2-cancel-large'
      },
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        setProcessing(true)
        setError(null)
        await deleteUser(user.id)
        
        // Actualizar la lista local de usuarios
        setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id))

        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          text: `El usuario "${user.name} ${user.surname}" ha sido eliminado correctamente.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
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
      } catch (err) {
        console.error('Error al eliminar el usuario:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario. Intenta nuevamente.',
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
        setProcessing(false)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setUserData({
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      role: 'user'
    })
    setFormErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      }
      
      // Generar username automáticamente cuando se cambia nombre o apellido
      // Solo si el username está vacío o coincide con el generado anteriormente
      if (name === 'name' || name === 'surname') {
        const firstName = name === 'name' ? value : prev.name
        const lastName = name === 'surname' ? value : prev.surname
        
        if (firstName && lastName) {
          const normalizedFirstName = normalizeText(firstName)
          const normalizedLastName = normalizeText(lastName)
          const generatedUsername = normalizedFirstName + '.' + normalizedLastName
          // Solo actualizar si el username está vacío o es el generado anteriormente
          const previousGenerated = prev.name && prev.surname 
            ? normalizeText(prev.name) + '.' + normalizeText(prev.surname) 
            : ''
          if (!updated.username || updated.username === previousGenerated) {
            updated.username = generatedUsername
          }
        }
      }
      
      return updated
    })

    // Limpiar error del campo cuando el usuario empieza a escribir o cuando tiene valor
    if (formErrors[name]) {
      // Para username, solo limpiar si tiene valor (no validar en tiempo real si está generado)
      if (name === 'username') {
        if (value.trim()) {
          setFormErrors((prev) => {
            const updated = { ...prev }
            delete updated.username
            return updated
          })
        }
      } else {
        // Para otros campos, limpiar el error normalmente
        setFormErrors((prev) => {
          const updated = { ...prev }
          delete updated[name]
          return updated
        })
      }
    }
  }

  const handleInputBlur = (e) => {
    const { name } = e.target
    
    // Para username, solo validar si está vacío (no validar si tiene valor generado automáticamente)
    if (name === 'username') {
      const validationErrors = validateUserData(userData)
      setFormErrors((prev) => {
        const updated = { ...prev }
        // Solo mostrar error de username si está vacío
        if (validationErrors.username) {
          updated.username = validationErrors.username
        } else {
          // Si tiene valor, eliminar el error si existe
          delete updated.username
        }
        return updated
      })
    } else {
      // Para otros campos, validar normalmente
      const validationErrors = validateUserData(userData)
      setFormErrors((prev) => {
        const updated = { ...prev }
        Object.keys(validationErrors).forEach((key) => {
          // No actualizar el error de username si tiene valor
          if (key === 'username' && userData.username && userData.username.trim()) {
            delete updated.username
          } else {
            updated[key] = validationErrors[key]
          }
        })
        return updated
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateUserData(userData)

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setFormErrors({})

    try {
      const newUser = await createUser(userData)
      
      // Actualizar la lista de usuarios
      setUsers((prevUsers) => [...prevUsers, newUser])
      
      // Cerrar modal y mostrar éxito
      handleCloseModal()
      
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: `El usuario "${newUser.name} ${newUser.surname}" ha sido creado correctamente.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
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
    } catch (err) {
      console.error('Error al crear usuario:', err)
      const errorMessage = err?.message || 'No se pudo crear el usuario. Intenta nuevamente.'
      setFormErrors({ general: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  // Calcular el username generado automáticamente para el placeholder
  const getGeneratedUsername = () => {
    if (userData.name && userData.surname) {
      const normalizedName = normalizeText(userData.name)
      const normalizedSurname = normalizeText(userData.surname)
      return normalizedName + '.' + normalizedSurname
    }
    return ''
  }

  const generatedUsernamePlaceholder = getGeneratedUsername()

  return (
    <UsersUI
      users={users}
      loading={loading}
      error={error}
      processing={processing}
      onToggleStatus={handleToggleStatus}
      onResetPassword={handleResetPassword}
      onDeleteUser={handleDeleteUser}
      showModal={showModal}
      userData={userData}
      formErrors={formErrors}
      submitting={submitting}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onInputChange={handleInputChange}
      onInputBlur={handleInputBlur}
      onSubmit={handleSubmit}
      usernamePlaceholder={generatedUsernamePlaceholder}
    />
  )
}
