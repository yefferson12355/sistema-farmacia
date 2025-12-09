/**
 * ValidarLote.jsx
 * Módulo: VALIDACIÓN DE LOTES
 * Escanea/busca lotes de medicamentos verificando existencia, vencimiento y disponibilidad
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingCart,
  FiAlertTriangle,
  FiAlertCircle,
  FiFileText,
  FiLogOut,
  FiHome,
  FiBarChart2,
  FiList,
  FiCode,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { buscarMedicamentos } from '../../services/api';
import { calcularDiasRestantes, getEstadoSemaforo } from '../../data/mockData';

function ValidarLote() {
  const navigate = useNavigate();
  const location = useLocation();
  const [codigoLote, setCodigoLote] = useState('');
  const [loteEncontrado, setLoteEncontrado] = useState(null);
  const [medicamento, setMedicamento] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Validar lote cuando se ingresa código
  const validarLote = async () => {
    if (!codigoLote.trim()) {
      setError('Por favor ingrese un código de lote');
      setLoteEncontrado(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Buscar todos los medicamentos para encontrar el lote
      const medicamentos = await buscarMedicamentos('');
      
      let loteFound = null;
      let medFound = null;

      for (const med of medicamentos) {
        const loteBuscado = med.lotes?.find(l => l.codigo === codigoLote.toUpperCase());
        if (loteBuscado) {
          medFound = med;
          loteFound = loteBuscado;
          break;
        }
      }

      if (!loteFound) {
        setError(`❌ Lote "${codigoLote}" no encontrado en el sistema`);
        setLoteEncontrado(null);
        setMedicamento(null);
      } else {
        setMedicamento(medFound);
        setLoteEncontrado(loteFound);
        setError('');
      }
    } catch (err) {
      setError('Error al validar lote. Por favor intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Validar cuando se presiona Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validarLote();
    }
  };

  // Limpiar búsqueda
  const limpiar = () => {
    setCodigoLote('');
    setLoteEncontrado(null);
    setMedicamento(null);
    setError('');
  };

  // Calcular estado del lote
  const getEstadoLote = (lote) => {
    const dias = calcularDiasRestantes(lote.fecha_vencimiento);
    const estado = getEstadoSemaforo(dias);
    
    return {
      diasRestantes: dias,
      estado: estado,
      bloqueado: dias <= 30,
      disponible: lote.cantidad > 0
    };
  };

  const estadoLote = loteEncontrado ? getEstadoLote(loteEncontrado) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
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
      }}>
        {/* Logo */}
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
          const isActive = location.pathname === item.path;
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

        {/* Logout */}
        <div style={{ marginTop: 'auto', width: '100%', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '8px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <button
              title="Cerrar Sesión"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiLogOut />
            </button>
            <span style={{ fontSize: '12px', color: '#dc2626', whiteSpace: 'nowrap' }}>
              Salir
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiCode style={{ color: '#3b82f6' }} />
            Validador de Lotes
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666' }}>
            Escanea o busca códigos de lote para verificar vencimiento y disponibilidad
          </p>
        </div>

        {/* Panel de Búsqueda */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                Código de Lote
              </label>
              <input
                type="text"
                placeholder="Ej: LT-2025-0001 o escanee con lector de códigos"
                value={codigoLote}
                onChange={(e) => setCodigoLote(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s'
                }}
              />
              <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0' }}>
                Presione Enter para validar o use un lector de códigos de barras
              </p>
            </div>
            <button
              onClick={validarLote}
              disabled={loading || !codigoLote.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: loading || !codigoLote.trim() ? '#e5e7eb' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !codigoLote.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <FiCode />
              {loading ? 'Validando...' : 'Validar'}
            </button>
            {loteEncontrado && (
              <button
                onClick={limpiar}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Resultado de Validación */}
        {loteEncontrado && estadoLote && medicamento && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Card Medicamento */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiPackage style={{ color: '#3b82f6' }} />
                Información del Medicamento
              </h2>
              
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Nombre Comercial</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0' }}>
                    {medicamento.nombre_comercial}
                  </p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Principio Activo</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '4px 0 0' }}>
                    {medicamento.principio_activo}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Ubicación</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '4px 0 0' }}>
                    {medicamento.ubicacion}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#0c4a6e', margin: 0 }}>Precio Venta</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#0369a1', margin: '4px 0 0' }}>
                    S/ {medicamento.precio_venta.toFixed(2)}
                  </p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#14532d', margin: 0 }}>Requiere Receta</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e', margin: '4px 0 0' }}>
                    {medicamento.requiere_receta ? '✓ Sí' : '✗ No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Lote */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${estadoLote.estado.color}`
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCode style={{ color: '#3b82f6' }} />
                Información del Lote
              </h2>

              <div style={{ 
                backgroundColor: 'white',
                border: `2px solid ${estadoLote.estado.color}`,
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Código</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0', fontFamily: 'monospace' }}>
                  {loteEncontrado.codigo}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Fecha Vencimiento</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0' }}>
                    {new Date(loteEncontrado.fecha_vencimiento).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div style={{ padding: '12px', backgroundColor: estadoLote.estado.bg, borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: estadoLote.estado.color, margin: 0, fontWeight: '600' }}>Días Restantes</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: estadoLote.estado.color, margin: '4px 0 0' }}>
                    {estadoLote.diasRestantes} días
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Cantidad Disponible</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: estadoLote.disponible ? '#22c55e' : '#ef4444', margin: '4px 0 0' }}>
                    {loteEncontrado.cantidad} unidades
                  </p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Estado</p>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: estadoLote.estado.color, margin: '4px 0 0' }}>
                    {estadoLote.estado.texto}
                  </p>
                </div>
              </div>

              {/* Indicadores */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
                {!estadoLote.bloqueado && estadoLote.disponible ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 }}>
                    <FiCheck style={{ color: '#22c55e', fontWeight: '700' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>✓ DISPONIBLE PARA VENTA</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '6px', flex: 1 }}>
                    <FiX style={{ color: '#ef4444', fontWeight: '700' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626' }}>🚫 BLOQUEADO PARA VENTA</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ValidarLote;
