import React, { useEffect, useState } from 'react'
import { getUsers, updateUserStatus, resetUserPassword } from '../../../services/users'
import { UsersUI } from './UsersUI'
import Swal from 'sweetalert2'

export const UsersContainer = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el estado del usuario. Intenta nuevamente.',
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

  return (
    <UsersUI
      users={users}
      loading={loading}
      error={error}
      processing={processing}
      onToggleStatus={handleToggleStatus}
      onResetPassword={handleResetPassword}
    />
  )
}
