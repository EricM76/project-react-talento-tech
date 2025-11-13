import { useState, useLayoutEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Estado del auth - inicializar desde localStorage o sessionStorage de forma síncrona
  const [auth, setAuth] = useState(() => {
    // Primero intentar cargar desde localStorage (si marcó "recordarme")
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (error) {
        console.error('Error al parsear datos de autenticación:', error);
        localStorage.removeItem('auth');
      }
    }
    
    // Si no hay en localStorage, intentar desde sessionStorage
    const sessionAuth = sessionStorage.getItem('auth');
    if (sessionAuth) {
      try {
        return JSON.parse(sessionAuth);
      } catch (error) {
        console.error('Error al parsear datos de autenticación de sesión:', error);
        sessionStorage.removeItem('auth');
      }
    }
    
    return null;
  });

  // Estado de inicialización: solo inicializar si hay auth guardado
  // Esto evita el parpadeo del formulario cuando hay una sesión activa
  const [isInitializing, setIsInitializing] = useState(() => {
    // Verificar si hay datos guardados para determinar si necesitamos inicializar
    const hasStoredAuth = localStorage.getItem('auth') !== null || sessionStorage.getItem('auth') !== null;
    return hasStoredAuth;
  });

  // Marcar como inicializado de forma síncrona antes del paint para evitar parpadeo
  useLayoutEffect(() => {
    // Si hay auth, marcar como no inicializando inmediatamente
    // useLayoutEffect se ejecuta antes del paint, evitando el parpadeo
    if (auth !== null) {
      setIsInitializing(false);
    } else {
      // Si no hay auth después de la inicialización, también marcar como no inicializando
      setIsInitializing(false);
    }
  }, []); // Solo ejecutar una vez al montar

  // Función para actualizar el estado de autenticación
  const updateAuth = (authData) => {
    setAuth(authData);
    
    // Si hay datos, guardarlos según la preferencia
    if (authData) {
      if (authData.remember) {
        // Guardar en localStorage si marcó "recordarme"
        localStorage.setItem('auth', JSON.stringify(authData));
        sessionStorage.removeItem('auth');
      } else {
        // Guardar en sessionStorage si no marcó "recordarme"
        sessionStorage.setItem('auth', JSON.stringify(authData));
        localStorage.removeItem('auth');
      }
    } else {
      // Si no hay datos, limpiar todo
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    updateAuth(null);
  };

  const value = {
    auth,
    setAuth: updateAuth,
    logout,
    isInitializing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

