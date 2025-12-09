import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/images/login-bg.jpg';
import '../styles/Login.css';

/**
 * Login
 * Componente de login profesional para SIGFARMA
 * Con autenticación real y validación de credenciales
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  // Si está verificando autenticación, mostrar loading
  if (authLoading) {
    return (
      <div className="login-container" style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="login-overlay"></div>
        <div className="login-content">
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="logo-circle" style={{ margin: '0 auto 16px auto' }}>
              <span className="logo-plus">+</span>
            </div>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="login-container"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="login-overlay"></div>
      
      <div className="login-content">
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <div className="logo-circle">
              <span className="logo-plus">+</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="login-title">SIGFARMA</h1>

          {/* Mensaje de Error */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} aria-label="login form" className="login-form">
            <label className="form-group">
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="Usuario"
                required
                className="form-input"
                disabled={loading}
                autoComplete="username"
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </label>

            <label className="form-group">
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Contraseña"
                required
                className="form-input"
                disabled={loading}
                autoComplete="current-password"
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </label>

            <button 
              type="submit" 
              className="btn-acceder"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '⏳ Iniciando...' : 'Acceder'}
            </button>
          </form>

          {/* Mostrar credenciales de prueba */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline'
              }}
            >
              {showCredentials ? 'Ocultar credenciales' : 'Ver credenciales de prueba'}
            </button>
            
            {showCredentials && (
              <div style={{
                marginTop: '12px',
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'left'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0369a1' }}>Usuarios disponibles:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Admin:</strong> admin / admin123</div>
                  <div><strong>Farmacéutico:</strong> farmaceutico / farma123</div>
                  <div><strong>Vendedor:</strong> vendedor / venta123</div>
                </div>
              </div>
            )}
          </div>

          <div className="login-info">
            <p className="support-text">¿Necesitas ayuda? Contáctanos:</p>
            <p className="phone-info">📞 +51 991322630</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Login;