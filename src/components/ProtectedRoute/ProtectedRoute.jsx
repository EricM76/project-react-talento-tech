import React from 'react'
import './ProtectedRoute.css'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, requireAdmin = false }) => {

    const { auth } = useContext(AuthContext)
    if (!auth) {
        return <Navigate to="/admin" />
    }

    // Si se requiere rol de administrador, validar
    if (requireAdmin && auth.role !== 'admin') {
        return <Navigate to="/admin/dashboard" />
    }

    return children
}
