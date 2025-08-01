
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, AuthResponse, UserInfo } from '../services/api';

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiService.setToken(token);
        
        // Verify token is still valid
        try {
          await apiService.getCurrentUser();
        } catch (error) {
          // Token might be expired, try to refresh
          if (refreshToken) {
            await refreshTokens(token, refreshToken);
          } else {
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async (accessToken: string, refreshToken: string) => {
    try {
      const response = await apiService.refreshToken(accessToken, refreshToken);
      await storeAuthData(response);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      await logout();
    }
  };

  const storeAuthData = async (authResponse: AuthResponse) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, authResponse.accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(authResponse.user)),
    ]);
    
    setUser(authResponse.user);
    apiService.setToken(authResponse.accessToken);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      await storeAuthData(response);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      await storeAuthData(response);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    
    setUser(null);
    apiService.setToken('');
  };

  const refreshAuth = async () => {
    const [token, refreshToken] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN_KEY),
    ]);

    if (token && refreshToken) {
      await refreshTokens(token, refreshToken);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
