/**
 * ProtectedRoute.jsx
 * Componente para proteger rutas que requieren autenticación
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 auto 16px auto',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            +
          </div>
          <p style={{ color: '#666', margin: 0 }}>Cargando SIGFARMA...</p>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si se especifican roles, verificar que el usuario tenga el rol requerido
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user?.rol);
    if (!hasRequiredRole) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <span style={{ fontSize: '32px' }}>🚫</span>
            </div>
            <h2 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>Acceso Denegado</h2>
            <p style={{ color: '#666', margin: '0 0 24px 0' }}>
              No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
