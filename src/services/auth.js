import jwt from 'jsonwebtoken'

// Clave secreta para firmar los tokens (en producción, usar variable de entorno)
const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_RECOVERY_SECRET = process.env.VITE_JWT_RECOVERY_SECRET || 'recovery-secret-key-change-in-production'

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @param {string} secret - Clave secreta para firmar
 * @param {string} expiresIn - Tiempo de expiración (ej: '24h', '1h')
 * @returns {string} Token JWT
 */
const generateToken = (payload, secret = JWT_SECRET, expiresIn = '24h') => {
  return jwt.sign(payload, secret, { expiresIn })
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @param {string} secret - Clave secreta para verificar
 * @returns {Object|null} Datos del token o null si es inválido
 */
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    if (!token) return null
    return jwt.verify(token, secret)
  } catch (error) {
    // Token inválido o expirado
    return null
  }
}

/**
 * Decodifica un token sin verificar (solo para lectura)
 * @param {string} token - Token JWT
 * @returns {Object|null} Datos del token o null si es inválido
 */
const decodeToken = (token) => {
  try {
    if (!token) return null
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

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
 * @returns {Promise<{user: Object, token: string}>} Usuario autenticado y token JWT
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

    // Generar token JWT con los datos del usuario
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      surname: user.surname
    }

    const token = generateToken(tokenPayload, JWT_SECRET, '24h')

    // Actualizar el token del usuario en la lista
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, token } : u
    )

    await saveUsers(updatedUsers)

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user
    return {
      user: { ...userWithoutPassword, token },
      token
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Genera un token de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<{token: string, user: Object}>} Token de recuperación y datos del usuario
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

    // Generar token de recuperación (expira en 1 hora)
    const recoveryTokenPayload = {
      id: user.id,
      email: user.email,
      type: 'password_recovery',
      purpose: 'reset_password'
    }

    const recoveryToken = generateToken(recoveryTokenPayload, JWT_RECOVERY_SECRET, '1h')

    // Aquí se debería enviar el token por email
    // Por ahora solo lo retornamos
    // TODO: Implementar envío de email con el token

    return {
      token: recoveryToken,
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
 * Actualiza la contraseña de un usuario usando un token de recuperación
 * @param {string} recoveryToken - Token de recuperación
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<{user: Object}>} Usuario actualizado
 */
const updatePassword = async (recoveryToken, newPassword) => {
  try {
    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    // Verificar y decodificar token de recuperación
    const tokenData = verifyToken(recoveryToken, JWT_RECOVERY_SECRET)
    if (!tokenData || tokenData.type !== 'password_recovery') {
      throw new Error('Token de recuperación inválido o expirado')
    }

    const users = await loadUsers()
    const user = users.find((u) => u.id === tokenData.id && u.email === tokenData.email)

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    if (!user.active) {
      throw new Error('El usuario está inactivo')
    }

    // Actualizar contraseña
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, password: newPassword, token: null } : u
    )

    await saveUsers(updatedUsers)

    const { password: _, ...userWithoutPassword } = user
    return {
      user: { ...userWithoutPassword, password: newPassword },
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
 * @returns {Promise<{user: Object}>} Usuario registrado
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
 * Verifica un token JWT de sesión (wrapper para usar la función principal)
 * @param {string} token - Token JWT
 * @returns {Object|null} Datos del token o null si es inválido
 */
const verifySessionToken = (token) => {
  return verifyToken(token, JWT_SECRET)
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
  verifyToken,
  verifySessionToken,
  decodeToken,
  getUserById,
  loadUsers
}

