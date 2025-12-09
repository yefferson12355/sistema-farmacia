/**
 * AuthContext.js
 * Contexto de autenticación para SIGFARMA
 * Maneja el estado de autenticación en toda la aplicación
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, verificarToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sigfarma_token');
      const savedUser = localStorage.getItem('sigfarma_user');
      
      if (token && savedUser) {
        try {
          await verificarToken(token);
          setUser(JSON.parse(savedUser));
        } catch (err) {
          // Token inválido o expirado, limpiar storage
          localStorage.removeItem('sigfarma_token');
          localStorage.removeItem('sigfarma_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await apiLogin(username, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('sigfarma_token', response.token);
        localStorage.setItem('sigfarma_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de autenticación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('sigfarma_token');
      localStorage.removeItem('sigfarma_user');
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.rol === roles;
    return roles.includes(user.rol);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
