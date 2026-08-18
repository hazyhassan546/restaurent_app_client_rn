import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearAuthTokens,
  getStoredAuthTokens,
  saveAuthTokens,
} from '../auth/storage';
import { renewAuthToken, verifyAuthToken } from '../api/auth/auth';

interface AuthContextValue {
  isAuthenticated: boolean | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  const loginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    await clearAuthTokens();
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        const { authToken, refreshToken } = await getStoredAuthTokens();

        if (!authToken || !refreshToken) {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        try {
          await verifyAuthToken();
          if (isMounted) {
            loginSuccess();
          }
          return;
        } catch {
          try {
            const response = await renewAuthToken();

            if (response?.access_token && response?.refresh_token) {
              await saveAuthTokens(
                response.access_token,
                response.refresh_token,
              );
              if (isMounted) {
                loginSuccess();
              }
              return;
            }

            throw new Error('Refresh token failed');
          } catch {
            await clearAuthTokens();
            if (isMounted) {
              setIsAuthenticated(false);
              setIsLoading(false);
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, loginSuccess, logout }}
    >
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
