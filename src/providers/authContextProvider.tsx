import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredAuthTokens, clearAuthTokens } from '../auth/storage';

interface AuthContextValue {
  isAuthenticated: boolean | null; // null = still checking
  loginSuccess: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // useEffect(() => {
  //   let isMounted = true;

  //   (async () => {
  //     try {
  //       const { authToken, refreshToken } = await getStoredAuthTokens();
  //       if (isMounted) setIsAuthenticated(Boolean(authToken && refreshToken));
  //     } catch (err) {
  //       console.error('Failed to restore session:', err);
  //       if (isMounted) setIsAuthenticated(false);
  //     }
  //   })();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const loginSuccess = () => setIsAuthenticated(true);

  const logout = async () => {
    await clearAuthTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
