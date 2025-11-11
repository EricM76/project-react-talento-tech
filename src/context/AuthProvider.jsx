import { useState  } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Estado del auth
  const [auth, setAuth] = useState(null);


  const value = {
    auth,
    setAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

