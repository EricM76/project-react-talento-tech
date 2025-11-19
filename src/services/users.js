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

// Cargar usuarios desde el JSON local
const loadUsersFromJSON = async () => {
  try {
    const response = await fetch('/data/users.json')
    if (!response.ok) {
      throw new Error('Error al cargar usuarios desde JSON')
    }
    const users = await response.json()
    return users
  } catch (error) {
    console.error('Error loading users from JSON:', error)
    throw error
  }
}

// Obtener cambios guardados en localStorage
const getStoredUserChanges = () => {
  try {
    const stored = localStorage.getItem('userChanges')
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error loading stored user changes:', error)
    return {}
  }
}

// Guardar cambios de usuario en localStorage
const saveUserChanges = (changes) => {
  try {
    localStorage.setItem('userChanges', JSON.stringify(changes))
  } catch (error) {
    console.error('Error saving user changes:', error)
  }
}

// Sincronizar cambios con el archivo JSON
const syncChangesToJSON = async () => {
  try {
    // Cargar usuarios base del JSON
    const baseUsers = await loadUsersFromJSON()
    
    // Aplicar cambios de localStorage
    const changes = getStoredUserChanges()
    const updatedUsers = baseUsers.map(user => {
      const userId = String(user.id)
      if (changes[userId]) {
        const updated = { ...user, ...changes[userId] }
        // Si está marcado como eliminado, no incluirlo
        if (updated.deleted) {
          return null
        }
        return updated
      }
      return user
    }).filter(user => user !== null)
    
    // Agregar usuarios nuevos (que no están en el JSON base)
    Object.keys(changes).forEach(userId => {
      const change = changes[userId]
      // Si tiene todos los campos necesarios y no está en el JSON base, es un usuario nuevo
      if (change.name && change.email && !baseUsers.find(u => String(u.id) === userId)) {
        updatedUsers.push(change)
      }
    })
    
    // Intentar guardar en el JSON usando el endpoint
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUsers)
    })
    
    if (response.ok) {
      // Si se guardó correctamente, limpiar localStorage
      localStorage.removeItem('userChanges')
      return true
    } else {
      console.warn('No se pudo sincronizar con el JSON, los cambios se mantienen en localStorage')
      return false
    }
  } catch (error) {
    // Si falla (por ejemplo en producción), solo guardar en localStorage
    console.warn('Error al sincronizar con JSON:', error)
    return false
  }
}

// Aplicar cambios guardados a los usuarios del JSON
const applyStoredChanges = (users) => {
  const changes = getStoredUserChanges()
  return users.map(user => {
    const userId = String(user.id)
    if (changes[userId]) {
      return { ...user, ...changes[userId] }
    }
    return user
  })
}

/**
 * Obtiene todos los usuarios (sin contraseñas)
 * Carga desde JSON local y aplica cambios guardados en localStorage
 * @returns {Promise<Array>} Lista de usuarios sin contraseñas
 */
const getUsers = async () => {
  try {
    // Cargar usuarios desde JSON local
    const localUsers = await loadUsersFromJSON()
    
    // Aplicar cambios guardados en localStorage
    const usersWithChanges = applyStoredChanges(localUsers)
    
    // Filtrar usuarios eliminados
    const activeUsers = usersWithChanges.filter(user => !user.deleted)
    
    // Retornar usuarios sin contraseñas
    return activeUsers.map(({ password, ...user }) => user)
  } catch (error) {
    console.error('Get users error:', error)
    throw new Error('No se pudieron cargar los usuarios')
  }
}

/**
 * Obtiene un usuario por ID (con contraseña para uso interno)
 * @param {number|string} id - ID del usuario
 * @returns {Promise<Object>} Usuario completo
 */
const getUserById = async (id) => {
  try {
    // Cargar usuarios desde JSON local
    const localUsers = await loadUsersFromJSON()
    
    // Aplicar cambios guardados
    const usersWithChanges = applyStoredChanges(localUsers)
    
    // Filtrar usuarios eliminados
    const activeUsers = usersWithChanges.filter(user => !user.deleted)
    
    // Buscar usuario por ID
    const user = activeUsers.find((u) => String(u.id) === String(id))
    if (user) {
      return user
    }
    
    throw new Error('Usuario no encontrado')
  } catch (error) {
    console.error('Get user by id error:', error)
    throw error
  }
}

/**
 * Actualiza el estado activo/inactivo de un usuario
 * @param {number|string} id - ID del usuario
 * @param {boolean} active - Nuevo estado activo
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
const updateUserStatus = async (id, active) => {
  try {
    // Obtener el usuario actual para mantener todos sus datos
    const currentUser = await getUserById(id)
    
    if (!currentUser) {
      throw new Error('Usuario no encontrado')
    }
    
    // Guardar el cambio en localStorage
    const changes = getStoredUserChanges()
    const userId = String(id)
    changes[userId] = {
      ...changes[userId],
      active: active
    }
    saveUserChanges(changes)
    
    // Intentar sincronizar con el JSON (en segundo plano, no bloquea)
    syncChangesToJSON().catch(err => {
      console.warn('Error al sincronizar cambios:', err)
    })
    
    // Retornar usuario actualizado sin contraseña
    const updatedUser = {
      ...currentUser,
      active: active
    }
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  } catch (error) {
    console.error('Update user status error:', error)
    throw error
  }
}

/**
 * Blanquea la contraseña de un usuario (la establece en "1234")
 * @param {number|string} id - ID del usuario
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
const resetUserPassword = async (id) => {
  try {
    // Obtener el usuario actual para mantener todos sus datos
    const currentUser = await getUserById(id)
    
    // Guardar el cambio en localStorage
    const changes = getStoredUserChanges()
    const userId = String(id)
    changes[userId] = {
      ...changes[userId],
      password: '1234'
    }
    saveUserChanges(changes)
    
    // Intentar sincronizar con el JSON (en segundo plano, no bloquea)
    syncChangesToJSON().catch(err => {
      console.warn('Error al sincronizar cambios:', err)
    })
    
    // Retornar usuario actualizado sin contraseña
    const updatedUser = {
      ...currentUser,
      password: '1234'
    }
    const { password, ...userWithoutPassword } = updatedUser
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
 * @param {string} userData.username - Nombre de usuario (opcional, se genera automáticamente si no se proporciona)
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

    // Cargar usuarios completos (con contraseñas) para validaciones
    const localUsers = await loadUsersFromJSON()
    const usersWithChanges = applyStoredChanges(localUsers)
    const activeUsers = usersWithChanges.filter(user => !user.deleted)

    // Verificar si el email ya existe
    const emailExists = activeUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      throw new Error('El email ya está registrado')
    }

    // Generar username automáticamente si no se proporciona
    let username = userData.username?.trim()
    if (!username) {
      const normalizedName = normalizeText(name)
      const normalizedSurname = normalizeText(surname)
      username = normalizedName + '.' + normalizedSurname
    }

    // Verificar si el username ya existe
    const usernameExists = activeUsers.some((u) => u.username && u.username.toLowerCase() === username.toLowerCase())
    if (usernameExists) {
      throw new Error('El nombre de usuario ya está en uso')
    }

    // Obtener el máximo ID de los usuarios existentes
    const maxId = activeUsers.length > 0 ? Math.max(...activeUsers.map((u) => Number(u.id) || 0)) : 0
    
    // Crear nuevo usuario
    const newUser = {
      id: maxId + 1,
      name: name.trim(),
      surname: surname.trim(),
      username: username,
      email: email.toLowerCase().trim(),
      password: password,
      token: null,
      role: role,
      active: true
    }

    // Guardar el nuevo usuario en localStorage
    const changes = getStoredUserChanges()
    const userId = String(newUser.id)
    changes[userId] = newUser
    saveUserChanges(changes)

    // Intentar sincronizar con el JSON (en segundo plano, no bloquea)
    syncChangesToJSON().catch(err => {
      console.warn('Error al sincronizar cambios:', err)
    })

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
 * @param {number|string} id - ID del usuario a eliminar
 * @returns {Promise<void>}
 */
const deleteUser = async (id) => {
  try {
    // Marcar el usuario como eliminado en localStorage
    const changes = getStoredUserChanges()
    const userId = String(id)
    changes[userId] = {
      ...changes[userId],
      deleted: true
    }
    saveUserChanges(changes)
    
    // Intentar sincronizar con el JSON (en segundo plano, no bloquea)
    syncChangesToJSON().catch(err => {
      console.warn('Error al sincronizar cambios:', err)
    })
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
  deleteUser,
  syncChangesToJSON
}

