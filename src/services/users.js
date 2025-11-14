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

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.name - Nombre del usuario
 * @param {string} userData.surname - Apellido del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {string} userData.role - Rol del usuario (opcional, por defecto 'user')
 * @returns {Promise<Object>} Usuario creado sin contraseña
 */
const createUser = async (userData) => {
  try {
    const { name, surname, email, password, role = 'user' } = userData

    // Validaciones
    if (!name || !surname || !email || !password) {
      throw new Error('Todos los campos son requeridos')
    }

    if (password.length < 4) {
      throw new Error('La contraseña debe tener al menos 4 caracteres')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido')
    }

    const users = await loadUsers()

    // Verificar si el email ya existe
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    // Generar nuevo ID
    const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0
    const newId = maxId + 1

    // Crear nuevo usuario
    const newUser = {
      id: newId,
      name: name.trim(),
      surname: surname.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      token: null,
      role: role,
      active: true
    }

    // Agregar usuario a la lista
    const updatedUsers = [...users, newUser]
    await saveUsers(updatedUsers)

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  } catch (error) {
    console.error('Create user error:', error)
    throw error
  }
}

/**
 * Elimina un usuario
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise<void>}
 */
const deleteUser = async (id) => {
  try {
    const users = await loadUsers()
    const userIndex = users.findIndex((u) => u.id === id)
    
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }

    // Eliminar usuario de la lista
    const updatedUsers = users.filter((u) => u.id !== id)
    await saveUsers(updatedUsers)
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}

export {
  getUsers,
  updateUserStatus,
  resetUserPassword,
  createUser,
  deleteUser
}

