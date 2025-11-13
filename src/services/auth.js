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
 * Autentica un usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{user: Object}>} Usuario autenticado (el token será generado por el backend)
 */
const login = async (email, password) => {
  try {
    const users = await loadUsers()
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active
    )

    if (!user) {
      throw new Error('Credenciales inválidas o usuario inactivo')
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
    if (!newPassword || newPassword.length < 6) {
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

    if (password.length < 6) {
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
      role: 'user',
      active: true
    }

    // Agregar usuario a la lista
    const updatedUsers = [...users, newUser]
    await saveUsers(updatedUsers)

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
 * @param {number} id - ID del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
const getUserById = async (id) => {
  try {
    const users = await loadUsers()
    const user = users.find((u) => u.id === id)
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
