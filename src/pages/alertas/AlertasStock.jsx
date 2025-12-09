import React, { useState, useEffect } from 'react';
import {
  FiRefreshCw,
  FiTruck,
  FiArrowUp,
  FiAlertCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getAlertasStockAPI as getAlertasStock } from '../../services/api';

/**
 * AlertasStock
 * Muestra productos con stock por debajo del mínimo
 * Sistema de semáforo: Naranja para stock crítico
 */
function AlertasStock() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const data = await getAlertasStock();
      setAlertas(data);
    } catch (error) {
      console.error('Error al cargar alertas de stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelCritico = (stockActual, stockMinimo) => {
    const porcentaje = (stockActual / stockMinimo) * 100;
    if (porcentaje <= 25) return { nivel: 'CRÍTICO', bg: '#fee2e2', color: '#dc2626', icon: '🔴' };
    if (porcentaje <= 50) return { nivel: 'BAJO', bg: '#fed7aa', color: '#ea580c', icon: '🟠' };
    return { nivel: 'ADVERTENCIA', bg: '#fef3c7', color: '#d97706', icon: '🟡' };
  };

  const calcularFaltante = (stockActual, stockMinimo) => {
    return Math.max(0, stockMinimo - stockActual);
  };

  const handleSolicitarReposicion = (alerta) => {
    alert(`Solicitud de reposición enviada para: ${alerta.medicamento}\nCantidad sugerida: ${calcularFaltante(alerta.stock_actual, alerta.stock_minimo) + 10} unidades`);
  };

  const handleContactarProveedor = (alerta) => {
    alert(`Contactando proveedor para: ${alerta.medicamento}\nProveedor: ${alerta.proveedor || 'No especificado'}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiAlertCircle style={{ color: '#f97316' }} />
              Alertas de Stock Crítico
            </h1>
            <p style={{ margin: '4px 0 0', color: '#666' }}>
              Productos con inventario por debajo del mínimo requerido
            </p>
          </div>
          <button
            onClick={cargarAlertas}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FiRefreshCw />
            Actualizar
          </button>
        </div>

        {/* Resumen Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #dc2626'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>Stock Crítico (≤25%)</p>
            <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
              {alertas.filter(a => (a.stock_actual / a.stock_minimo) <= 0.25).length}
            </p>
          </div>
          <div style={{
            backgroundColor: '#fed7aa',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #ea580c'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#9a3412' }}>Stock Bajo (≤50%)</p>
            <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#ea580c' }}>
              {alertas.filter(a => {
                const p = (a.stock_actual / a.stock_minimo);
                return p > 0.25 && p <= 0.5;
              }).length}
            </p>
          </div>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #d97706'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>Advertencia (≤75%)</p>
            <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>
              {alertas.filter(a => {
                const p = (a.stock_actual / a.stock_minimo);
                return p > 0.5 && p <= 0.75;
              }).length}
            </p>
          </div>
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>Total Alertas</p>
            <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {alertas.length}
            </p>
          </div>
        </div>

        {/* Tabla de Alertas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            backgroundColor: '#f97316',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertCircle />
              Productos con Stock Bajo ({alertas.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Cargando alertas...
            </div>
          ) : alertas.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#22c55e' }}>
              ✅ No hay productos con stock bajo. ¡Todo en orden!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Estado</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Medicamento</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Stock Actual</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Stock Mínimo</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Faltante</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Ubicación</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alertas.sort((a, b) => (a.stock_actual/a.stock_minimo) - (b.stock_actual/b.stock_minimo)).map((alerta, idx) => {
                  const nivel = getNivelCritico(alerta.stock_actual, alerta.stock_minimo);
                  const faltante = calcularFaltante(alerta.stock_actual, alerta.stock_minimo);
                  return (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid #eee',
                        backgroundColor: nivel.nivel === 'CRÍTICO' ? '#fef2f2' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: nivel.bg,
                          color: nivel.color
                        }}>
                          {nivel.icon} {nivel.nivel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: '500', color: '#1a1a2e' }}>{alerta.medicamento}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>
                            {alerta.principio_activo}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: nivel.color 
                        }}>
                          {alerta.stock_actual}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#666' }}>
                        {alerta.stock_minimo}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#dc2626',
                          fontWeight: '600'
                        }}>
                          <FiArrowUp />
                          {faltante}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>
                        {alerta.ubicacion}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleSolicitarReposicion(alerta)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              backgroundColor: '#f97316',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                            title="Solicitar Reposición"
                          >
                            <FiRefreshCw size={14} />
                            Reponer
                          </button>
                          <button
                            onClick={() => handleContactarProveedor(alerta)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                            title="Contactar Proveedor"
                          >
                            <FiTruck size={14} />
                            Proveedor
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Tip Box */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          borderLeft: '4px solid #f59e0b',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <FiAlertTriangle style={{ color: '#f59e0b', fontSize: '20px', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: '#92400e' }}>Consejo de Gestión</p>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#a16207' }}>
              Mantener un stock adecuado evita pérdidas de ventas y garantiza la satisfacción del cliente. 
              Configure alertas automáticas para reposición cuando el stock llegue al 50% del mínimo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AlertasStock;
