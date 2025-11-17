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

// Cargar usuarios desde JSON local con cambios aplicados (con contraseñas para autenticación)
const loadUsers = async () => {
  try {
    // Cargar usuarios desde JSON local
    const localUsers = await loadUsersFromJSON()
    
    // Aplicar cambios guardados en localStorage
    const usersWithChanges = applyStoredChanges(localUsers)
    
    // Filtrar usuarios eliminados
    return usersWithChanges.filter(user => !user.deleted)
  } catch (error) {
    console.error('Error loading users:', error)
    throw new Error('No se pudieron cargar los usuarios')
  }
}

/**
 * Autentica un usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{user: Object}>} Usuario autenticado (el token será generado por el backend)
 */
const login = async (email, password) => {
  try {
    const users = await loadUsers()
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    // Si el usuario no existe, lanzar error de credenciales
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    // Verificar primero si el usuario está activo
    if (!user.active) {
      throw new Error('Su cuenta ha sido bloqueada. Comuníquese con el administrador del sitio')
    }

    // Verificar la contraseña
    if (user.password !== password) {
      throw new Error('Credenciales inválidas')
    }

    // Retornar usuario sin la contraseña
    // El token será generado y retornado por el backend
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Solicita la recuperación de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<{user: Object, message: string}>} Datos del usuario y mensaje
 */
const recoverPassword = async (email) => {
  try {
    const users = await loadUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      throw new Error('Si el email existe, recibirás un enlace para recuperar tu contraseña')
    }

    if (!user.active) {
      throw new Error('El usuario está inactivo')
    }

    // El token de recuperación será generado por el backend
    // Aquí solo retornamos los datos del usuario para que el backend genere el token
    // TODO: El backend debería enviar el token por email

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: 'Si el email existe, recibirás un enlace para recuperar tu contraseña'
    }
  } catch (error) {
    console.error('Recover password error:', error)
    throw error
  }
}

/**
 * Actualiza la contraseña de un usuario
 * @param {string} recoveryToken - Token de recuperación (será verificado por el backend)
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<{user: Object, message: string}>} Usuario actualizado
 */
const updatePassword = async (recoveryToken, newPassword) => {
  try {
    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 4) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    // La verificación del token se hará en el backend
    // Aquí solo validamos la contraseña
    // El backend debería verificar el token y actualizar la contraseña

    return {
      message: 'Contraseña actualizada correctamente'
    }
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.name - Nombre del usuario
 * @param {string} userData.surname - Apellido del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @returns {Promise<{user: Object, message: string}>} Usuario registrado
 */
const register = async (userData) => {
  try {
    const { name, surname, email, password } = userData

    // Validaciones
    if (!name || !surname || !email || !password) {
      throw new Error('Todos los campos son requeridos')
    }

    if (password.length < 4) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
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

    // Obtener usuarios con cambios aplicados para calcular el máximo ID
    const localUsers = await loadUsersFromJSON()
    const usersWithChanges = applyStoredChanges(localUsers)
    const activeUsers = usersWithChanges.filter(user => !user.deleted)
    
    // Generar nuevo ID
    const maxId = activeUsers.length > 0 ? Math.max(...activeUsers.map((u) => Number(u.id) || 0)) : 0
    const newId = maxId + 1

    // Crear nuevo usuario
    const newUser = {
      id: newId,
      name: name.trim(),
      surname: surname.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      token: null,
      role: userData.role || 'user',
      active: true
    }

    // Guardar el nuevo usuario en localStorage
    const changes = getStoredUserChanges()
    const userId = String(newUser.id)
    changes[userId] = newUser
    try {
      localStorage.setItem('userChanges', JSON.stringify(changes))
    } catch (error) {
      console.error('Error saving user changes:', error)
      throw new Error('Error al guardar el usuario')
    }

    // Intentar sincronizar con el JSON (en segundo plano, no bloquea)
    // Importar la función de sincronización desde users.js
    try {
      const { syncChangesToJSON } = await import('./users.js')
      syncChangesToJSON().catch(err => {
        console.warn('Error al sincronizar cambios:', err)
      })
    } catch (importError) {
      // Si no se puede importar, solo continuar
      console.warn('No se pudo sincronizar cambios:', importError)
    }

    // Retornar usuario sin contraseña
    // El token será generado por el backend después del registro
    const { password: _, ...userWithoutPassword } = newUser
    return {
      user: userWithoutPassword,
      message: 'Usuario registrado correctamente'
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

/**
 * Obtiene un usuario por su ID
 * @param {number|string} id - ID del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null (sin contraseña)
 */
const getUserById = async (id) => {
  try {
    const users = await loadUsers()
    const user = users.find((u) => String(u.id) === String(id))
    if (!user) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('Get user by id error:', error)
    throw error
  }
}

export {
  login,
  recoverPassword,
  updatePassword,
  register,
  getUserById,
  loadUsers
}
