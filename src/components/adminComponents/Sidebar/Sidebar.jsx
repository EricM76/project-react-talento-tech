import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { register } from '../../../services/auth'
import Swal from 'sweetalert2'
import './Sidebar.css'

const menuItems = [
  { label: 'Panel', to: '/admin/dashboard' },
  { label: 'Productos', to: '/admin/productos' },
  { label: 'Usuarios', to: '/admin/usuarios' }
]

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleAddProduct = () => {
    navigate('/admin/productos/nuevo')
    onClose?.()
  }

  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Registrar nuevo usuario',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" required>
        <input id="swal-surname" class="swal2-input" placeholder="Apellido" required>
        <input id="swal-email" class="swal2-input" type="email" placeholder="Email" required>
        <input id="swal-password" class="swal2-input" type="password" placeholder="Contraseña" required>
        <select id="swal-role" class="swal2-select" style="width: 100%; margin-top: 10px; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db;">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      width: '600px',
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-large',
        cancelButton: 'swal2-cancel-large'
      },
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const surname = document.getElementById('swal-surname').value.trim()
        const email = document.getElementById('swal-email').value.trim()
        const password = document.getElementById('swal-password').value
        const role = document.getElementById('swal-role').value

        if (!name || !surname || !email || !password) {
          Swal.showValidationMessage('Todos los campos son requeridos')
          return false
        }

        if (password.length < 4) {
          Swal.showValidationMessage('La contraseña debe tener al menos 4 caracteres')
          return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Email inválido')
          return false
        }

        return { name, surname, email, password, role }
      }
    })

    if (formValues) {
      try {
        await register(formValues)
        
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'El usuario ha sido registrado correctamente.',
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

        // Si estamos en la página de usuarios, recargar la página para actualizar la lista
        if (window.location.pathname === '/admin/usuarios') {
          window.location.reload()
        } else {
          // Si no, navegar a la página de usuarios
          navigate('/admin/usuarios')
        }
      } catch (err) {
        console.error('Error al registrar el usuario:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.message || 'No se pudo registrar el usuario. Intenta nuevamente.',
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
      }
    }
    onClose?.()
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
    onClose?.()
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className='sidebar-header'>
        <span className='sidebar-title'>TalentoTech Admin</span>
        <button
          type='button'
          className='sidebar-close'
          aria-label='Cerrar menú'
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <div key={item.label} className='sidebar-item'>
            <NavLink
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
              onClick={onClose}
              end
            >
              {item.label}
            </NavLink>
            {item.label === 'Productos' && (
              <button
                type='button'
                className='sidebar-action-button'
                title='Agregar nuevo producto'
                aria-label='Agregar nuevo producto'
                onClick={handleAddProduct}
              >
                <i className='fa-solid fa-plus' aria-hidden='true' />
              </button>
            )}
            {item.label === 'Usuarios' && (
              <button
                type='button'
                className='sidebar-action-button'
                title='Registrar nuevo usuario'
                aria-label='Registrar nuevo usuario'
                onClick={handleAddUser}
              >
                <i className='fa-solid fa-user-plus' aria-hidden='true' />
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className='sidebar-footer'>
        <button
          type='button'
          className='sidebar-logout-button'
          onClick={handleLogout}
          title='Cerrar sesión'
          aria-label='Cerrar sesión'
        >
          <i className='fa-solid fa-sign-out-alt' aria-hidden='true' />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
