/**
 * Sidebar.jsx
 * Componente REUTILIZABLE de navegación lateral
 * Consistente en todas las páginas del sistema
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiList,
  FiAlertTriangle,
  FiAlertCircle,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiUser,
  FiClock,
} from 'react-icons/fi';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <FiHome />, label: 'Inicio', path: '/dashboard', tooltip: 'Inicio' },
    { icon: <FiPackage />, label: 'Inventario', path: '/medicamentos', tooltip: 'Inventario de Medicamentos' },
    { icon: <FiShoppingCart />, label: 'Nueva Venta', path: '/ventas/nueva', tooltip: 'Registrar Venta' },
    { icon: <FiList />, label: 'Historial', path: '/ventas/historial', tooltip: 'Historial de Ventas' },
    { icon: <FiAlertTriangle />, label: 'Vencimiento', path: '/alertas/vencimiento', tooltip: 'Alertas de Vencimiento' },
    { icon: <FiAlertCircle />, label: 'Stock Bajo', path: '/alertas/stock', tooltip: 'Alertas de Stock' },
    { icon: <FiFileText />, label: 'Reportes', path: '/reportes/exportar', tooltip: 'Exportar Reportes' },
    { icon: <FiBarChart2 />, label: 'KPIs', path: '/reportes/kpis', tooltip: 'Dashboard KPIs' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Obtener hora actual
  const [hora, setHora] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside style={{
      width: 'auto',
      minWidth: '180px',
      backgroundColor: '#f0f0f0',
      borderRight: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '20px 12px',
      gap: '8px',
      overflowY: 'auto',
      position: 'relative',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Logo/Brand */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px',
        width: '100%',
        paddingBottom: '10px',
        borderBottom: '1px solid #ddd'
      }}>
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
          cursor: 'pointer',
          flexShrink: 0
        }}
        onClick={() => navigate('/dashboard')}
        title="SIGFARMA"
        >
          +
        </div>
        <span style={{ fontSize: '12px', color: '#333', fontWeight: '600', whiteSpace: 'nowrap' }}>
          SIGFARMA
        </span>
      </div>

      {/* Menu Items */}
      {menuItems.map((item, idx) => {
        const isActive = location.pathname === item.path || 
          (item.path === '/medicamentos' && location.pathname.startsWith('/medicamentos'));
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '8px',
              backgroundColor: isActive ? '#e3f2fd' : 'transparent',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => navigate(item.path)}
          >
            <button
              title={item.tooltip}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? '#1976d2' : 'white',
                color: isActive ? 'white' : '#1976d2',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: isActive ? '0 2px 8px rgba(25,118,210,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                flexShrink: 0
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#1976d2';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,118,210,0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#1976d2';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }
              }}
            >
              {item.icon}
            </button>
            <span style={{ 
              fontSize: '12px', 
              color: isActive ? '#1976d2' : '#333', 
              whiteSpace: 'nowrap', 
              flex: 1,
              fontWeight: isActive ? '600' : '400'
            }}>
              {item.label}
            </span>
          </div>
        );
      })}

      {/* Separador */}
      <div style={{
        width: 'calc(100% - 24px)',
        height: '1px',
        backgroundColor: '#ddd',
        margin: '8px 12px'
      }} />

      {/* Usuario Info */}
      {user && (
        <div style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <FiUser size={14} color="#2e7d32" />
            <span style={{ fontSize: '11px', color: '#2e7d32', fontWeight: '600' }}>
              {user.nombre || user.username}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
            {user.rol === 'admin' ? '👑 Administrador' : 
             user.rol === 'farmaceutico' ? '💊 Farmacéutico' : '🛒 Vendedor'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <FiClock size={12} color="#666" />
            <span style={{ fontSize: '10px', color: '#666' }}>
              {hora.toLocaleTimeString('es-PE')}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            <FiLogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
