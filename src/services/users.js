// Cargar usuarios desde el JSON
const loadUsers = async () => {
  try {
    const response = await fetch('/data/users.json')
    if (!response.ok) {
      throw new Error('Error al cargar usuarios')
    }
    const users = await response.json()
    return users
  } catch (error) {
    console.error('Error loading users:', error)
    throw error
  }
}

// Guardar usuarios en el JSON (simulado - en producción esto debería ser una API)
const saveUsers = async (users) => {
  // Nota: En un entorno real, esto debería hacer una petición PUT/PATCH a una API
  // Por ahora, solo retornamos los usuarios actualizados
  // El guardado real debería manejarse desde el backend
  return users
}

/**
 * Obtiene todos los usuarios (sin contraseñas)
 * @returns {Promise<Array>} Lista de usuarios sin contraseñas
 */
const getUsers = async () => {
  try {
    const users = await loadUsers()
    // Retornar usuarios sin contraseñas
    return users.map(({ password, ...user }) => user)
  } catch (error) {
    console.error('Get users error:', error)
    throw error
  }
}

/**
 * Actualiza el estado activo/inactivo de un usuario
 * @param {number} id - ID del usuario
 * @param {boolean} active - Nuevo estado activo
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
const updateUserStatus = async (id, active) => {
  try {
    const users = await loadUsers()
    const userIndex = users.findIndex((u) => u.id === id)
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }

    // Actualizar el estado
    users[userIndex].active = active
    await saveUsers(users)

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  } catch (error) {
    console.error('Update user status error:', error)
    throw error
  }
}

/**
 * Blanquea la contraseña de un usuario (la establece en "1234")
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
const resetUserPassword = async (id) => {
  try {
    const users = await loadUsers()
    const userIndex = users.findIndex((u) => u.id === id)
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }

    // Blanquear contraseña
    users[userIndex].password = '1234'
    await saveUsers(users)

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  } catch (error) {
    console.error('Reset user password error:', error)
    throw error
  }
}

export {
  getUsers,
  updateUserStatus,
  resetUserPassword
}

