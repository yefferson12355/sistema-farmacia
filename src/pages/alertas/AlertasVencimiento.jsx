/**
 * AlertasVencimiento.jsx
 * Módulo: ALERTAS (Gestión Proactiva)
 * Lista de productos por vencer y vencidos con acciones sugeridas
 */

import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiTrash2, FiTag, FiTruck, FiClock } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getAlertasVencimientoAPI, getAlertasStockAPI } from '../../services/api';

function AlertasVencimiento() {
  const [tabActiva, setTabActiva] = useState('vencidos');
  const [alertasVencimiento, setAlertasVencimiento] = useState([]);
  const [alertasStock, setAlertasStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      setLoading(true);
      const [vencimiento, stock] = await Promise.all([
        getAlertasVencimientoAPI(),
        getAlertasStockAPI()
      ]);
      setAlertasVencimiento(vencimiento);
      setAlertasStock(stock);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const vencidos = alertasVencimiento.filter(a => a.dias_restantes <= 30);
  const porVencer = alertasVencimiento.filter(a => a.dias_restantes > 30 && a.dias_restantes <= 60);

  const tabs = [
    { id: 'vencidos', label: 'Vencidos', color: '#ef4444', count: vencidos.length, icon: <FiAlertTriangle /> },
    { id: 'por_vencer', label: 'Por Vencer', color: '#eab308', count: porVencer.length, icon: <FiClock /> },
    { id: 'stock', label: 'Stock Crítico', color: '#f97316', count: alertasStock.length, icon: <FiTag /> },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Cargando alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header with Page Indicator */}
        <div style={{ padding: '24px', borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px'
            }}>
              📍 ALERTAS - VENCIMIENTO
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#333', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <FiAlertTriangle color="#ef4444" size={32} /> Centro de Alertas
          </h1>
          <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0 0' }}>Gestión de productos vencidos y stock crítico</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', padding: '24px', borderBottom: '1px solid #ddd', backgroundColor: '#fafafa', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: tabActiva === tab.id ? tab.color : 'white',
                color: tabActiva === tab.id ? 'white' : '#666',
                border: `2px solid ${tab.color}`,
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
              <span style={{
                backgroundColor: tabActiva === tab.id ? 'rgba(255,255,255,0.3)' : tab.color,
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido según tab */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            
            {/* Tab Vencidos */}
            {tabActiva === 'vencidos' && (
              <div>
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fef2f2' }}>
                  <h3 style={{ color: '#ef4444', fontWeight: '600', margin: 0 }}>🔴 Productos Vencidos - Acción: DAR DE BAJA</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Estos productos no pueden venderse. Deben retirarse del inventario.</p>
                </div>
                {vencidos.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay productos vencidos</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Medicamento</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Lote</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Cantidad</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Vencimiento</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Días</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vencidos.map(alerta => (
                        <tr key={alerta.id} style={{ backgroundColor: '#fef2f2' }}>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>{alerta.medicamento}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>{alerta.lote}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>{alerta.cantidad}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>{alerta.fecha_vencimiento}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca', color: '#ef4444', fontWeight: '700' }}>{alerta.dias_restantes} días</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                              <FiTrash2 /> Dar de Baja
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Tab Por Vencer */}
            {tabActiva === 'por_vencer' && (
              <div>
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fefce8' }}>
                  <h3 style={{ color: '#eab308', fontWeight: '600', margin: 0 }}>🟡 Por Vencer (30-60 días) - Acción: APLICAR DESCUENTO</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Estos productos deben venderse pronto. Considere promociones o devolución a proveedor.</p>
                </div>
                {porVencer.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay productos por vencer</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Medicamento</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Lote</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Cantidad</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Vencimiento</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Días</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porVencer.map(alerta => (
                        <tr key={alerta.id}>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{alerta.medicamento}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{alerta.lote}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{alerta.cantidad}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{alerta.fecha_vencimiento}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', color: '#eab308', fontWeight: '700' }}>{alerta.dias_restantes} días</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                <FiTag /> Descuento
                              </button>
                              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                <FiTruck /> Devolver
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Tab Stock Crítico */}
            {tabActiva === 'stock' && (
              <div>
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff7ed' }}>
                  <h3 style={{ color: '#f97316', fontWeight: '600', margin: 0 }}>🟠 Stock Crítico - Acción: REABASTECER</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Estos productos tienen stock menor al mínimo requerido.</p>
                </div>
                {alertasStock.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay productos con stock crítico</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Medicamento</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Stock Actual</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Stock Mínimo</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Déficit</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Ubicación</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#666', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertasStock.map(alerta => (
                        <tr key={alerta.id} style={{ backgroundColor: '#fff7ed' }}>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa' }}>{alerta.medicamento}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa', color: '#ef4444', fontWeight: '700' }}>{alerta.stock_actual}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa' }}>{alerta.stock_minimo}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa', color: '#f97316', fontWeight: '700' }}>-{alerta.deficit}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa' }}>{alerta.ubicacion}</td>
                          <td style={{ padding: '12px 16px', borderBottom: '1px solid #fed7aa' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                              <FiTruck /> Pedir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default AlertasVencimiento;
