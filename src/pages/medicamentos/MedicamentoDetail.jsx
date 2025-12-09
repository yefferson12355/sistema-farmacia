/**
 * MedicamentoDetail.jsx
 * Módulo: DETALLE COMPLETO DEL MEDICAMENTO
 * Muestra información detallada, lotes, historial y acciones
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiPackage, FiArrowLeft, FiEdit, FiTrash2, FiAlertTriangle,
  FiMapPin, FiDollarSign, FiBox, FiCalendar, FiClipboard,
  FiCheckCircle, FiXCircle, FiClock
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getMedicamentoById } from '../../services/api';
import { calcularDiasRestantes, getEstadoSemaforo } from '../../data/mockData';

function MedicamentoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  const cargarMedicamento = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMedicamentoById(id);
      setMedicamento(data);
    } catch (error) {
      console.error('Error al cargar medicamento:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargarMedicamento();
  }, [cargarMedicamento]);

  const getEstadoGeneral = () => {
    if (!medicamento || !medicamento.lotes) return { estado: 'sin_datos', color: '#9ca3af', bg: '#f3f4f6', texto: 'SIN DATOS' };
    
    let menorDias = Infinity;
    medicamento.lotes.forEach(lote => {
      const dias = calcularDiasRestantes(lote.fecha_vencimiento);
      if (dias < menorDias) menorDias = dias;
    });
    
    return getEstadoSemaforo(menorDias);
  };

  const getStockStatus = () => {
    if (!medicamento) return { status: 'normal', color: '#22c55e', text: 'Normal' };
    if (medicamento.stock_total <= 0) return { status: 'agotado', color: '#dc2626', text: 'AGOTADO' };
    if (medicamento.stock_total <= medicamento.stock_minimo) return { status: 'bajo', color: '#f97316', text: 'Stock Bajo' };
    return { status: 'normal', color: '#22c55e', text: 'Normal' };
  };

  const handleEliminar = () => {
    if (window.confirm('¿Está seguro de eliminar este medicamento? Esta acción no se puede deshacer.')) {
      alert('Medicamento eliminado (simulación)');
      navigate('/medicamentos');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FiPackage size={48} color="#1976d2" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#666' }}>Cargando medicamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!medicamento) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FiXCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#666', marginBottom: '16px' }}>Medicamento no encontrado</p>
            <button onClick={() => navigate('/medicamentos')} style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Volver al Inventario
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estadoGeneral = getEstadoGeneral();
  const stockStatus = getStockStatus();

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => navigate('/medicamentos')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#374151' }}>
              <FiArrowLeft /> Volver
            </button>
            <span style={{ backgroundColor: '#1976d2', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>📍 DETALLE</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiPackage color="#1976d2" />
                {medicamento.nombre_comercial}
              </h1>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                <strong>Principio Activo:</strong> {medicamento.principio_activo}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => navigate(`/medicamentos/edit/${id}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                <FiEdit /> Editar
              </button>
              <button onClick={handleEliminar} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                <FiTrash2 /> Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {/* Cards de Estado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Stock */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${stockStatus.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Stock Total</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: stockStatus.color, margin: 0 }}>{medicamento.stock_total}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>Mínimo: {medicamento.stock_minimo}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stockStatus.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiBox size={24} color={stockStatus.color} />
                </div>
              </div>
            </div>

            {/* Precio */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #22c55e' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Precio de Venta</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', margin: 0 }}>S/ {medicamento.precio_venta.toFixed(2)}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>Valor Total: S/ {(medicamento.stock_total * medicamento.precio_venta).toFixed(2)}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiDollarSign size={24} color="#22c55e" />
                </div>
              </div>
            </div>

            {/* Estado de Vencimiento */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${estadoGeneral.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Estado General</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: estadoGeneral.color, margin: 0 }}>{estadoGeneral.texto}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>{medicamento.lotes?.length || 0} lotes registrados</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${estadoGeneral.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCalendar size={24} color={estadoGeneral.color} />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Ubicación</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>{medicamento.ubicacion}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>{medicamento.requiere_receta ? '💊 Requiere Receta' : '✅ Venta Libre'}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiMapPin size={24} color="#8b5cf6" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { key: 'info', label: 'Información', icon: <FiClipboard /> },
                { key: 'lotes', label: 'Lotes', icon: <FiBox /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px',
                    backgroundColor: activeTab === tab.key ? '#f0f9ff' : 'transparent',
                    border: 'none', borderBottom: activeTab === tab.key ? '3px solid #1976d2' : '3px solid transparent',
                    cursor: 'pointer', color: activeTab === tab.key ? '#1976d2' : '#6b7280',
                    fontWeight: activeTab === tab.key ? '600' : '400', fontSize: '14px'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px' }}>
              {activeTab === 'info' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Información General</h3>
                    <table style={{ width: '100%', fontSize: '14px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>ID</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>#{medicamento.id}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Nombre Comercial</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>{medicamento.nombre_comercial}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Principio Activo</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>{medicamento.principio_activo}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Ubicación</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>{medicamento.ubicacion}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Requiere Receta</td>
                          <td style={{ padding: '12px 0' }}>
                            {medicamento.requiere_receta ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                <FiAlertTriangle size={12} /> Sí, Requiere
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                <FiCheckCircle size={12} /> No Requiere
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Información de Stock</h3>
                    <table style={{ width: '100%', fontSize: '14px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Stock Total</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>{medicamento.stock_total} unidades</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Stock Mínimo</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>{medicamento.stock_minimo} unidades</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Precio de Venta</td>
                          <td style={{ padding: '12px 0', fontWeight: '500' }}>S/ {medicamento.precio_venta.toFixed(2)}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Valor en Inventario</td>
                          <td style={{ padding: '12px 0', fontWeight: '500', color: '#22c55e' }}>S/ {(medicamento.stock_total * medicamento.precio_venta).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px 0', color: '#6b7280' }}>Estado de Stock</td>
                          <td style={{ padding: '12px 0' }}>
                            <span style={{ backgroundColor: `${stockStatus.color}20`, color: stockStatus.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                              {stockStatus.text}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'lotes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>Lotes Registrados</h3>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {medicamento.lotes?.length || 0} lotes
                    </span>
                  </div>
                  
                  {medicamento.lotes && medicamento.lotes.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                          <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Código</th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Cantidad</th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Fecha Vencimiento</th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Días Restantes</th>
                          <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicamento.lotes.map(lote => {
                          const dias = calcularDiasRestantes(lote.fecha_vencimiento);
                          const estado = getEstadoSemaforo(dias);
                          return (
                            <tr key={lote.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1976d2' }}>{lote.codigo}</td>
                              <td style={{ padding: '14px 16px' }}>{lote.cantidad} unidades</td>
                              <td style={{ padding: '14px 16px' }}>{lote.fecha_vencimiento}</td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <FiClock size={14} />
                                  {dias <= 0 ? 'Vencido' : `${dias} días`}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ backgroundColor: estado.bg, color: estado.color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                                  {estado.texto}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                      <FiBox size={48} style={{ marginBottom: '12px' }} />
                      <p>No hay lotes registrados para este medicamento</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MedicamentoDetail;
