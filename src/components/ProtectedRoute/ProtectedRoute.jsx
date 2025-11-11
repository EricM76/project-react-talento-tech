import React from 'react'
import './ProtectedRoute.css'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {

    const { auth } = useContext(AuthContext)
    if (!auth) {
        return <Navigate to="/admin" />
    }

    return children
}
