/**
 * MedicamentosList.jsx
 * Módulo: INVENTARIO DE MEDICAMENTOS
 * Con sidebar consistente y filtros inteligentes
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiChevronDown, FiChevronUp, FiAlertTriangle, 
  FiPlus, FiSearch,
  FiClock, FiBox, FiAlertCircle
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getMedicamentos } from '../../services/api';
import { calcularDiasRestantes, getEstadoSemaforo } from '../../data/mockData';

function MedicamentosList() {
  const navigate = useNavigate();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [lotesExpandidos, setLotesExpandidos] = useState({});
  const [filtroActivo, setFiltroActivo] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      setLoading(true);
      const data = await getMedicamentos();
      setMedicamentos(data);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLotes = (id) => {
    setLotesExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getEstadoMedicamento = (med) => {
    let menorDias = Infinity;
    med.lotes.forEach(lote => {
      const dias = calcularDiasRestantes(lote.fecha_vencimiento);
      if (dias < menorDias) menorDias = dias;
    });
    return { ...getEstadoSemaforo(menorDias), diasRestantes: menorDias };
  };

  const getRowStatus = (med) => {
    const estado = getEstadoMedicamento(med);
    const stockBajo = med.stock_total <= med.stock_minimo;
    if (estado.diasRestantes <= 0) return 'vencido';
    if (estado.diasRestantes <= 30) return 'porVencer';
    if (stockBajo) return 'stockBajo';
    return 'normal';
  };

  const getRowStyles = (status, isHovered) => {
    const styles = {
      vencido: { backgroundColor: isHovered ? '#fee2e2' : '#fef2f2', borderLeft: '4px solid #ef4444' },
      porVencer: { backgroundColor: isHovered ? '#fef3c7' : '#fffbeb', borderLeft: '4px solid #f59e0b' },
      stockBajo: { backgroundColor: isHovered ? '#ffedd5' : '#fff7ed', borderLeft: '4px solid #f97316' },
      normal: { backgroundColor: isHovered ? '#f8fafc' : 'white', borderLeft: '4px solid transparent' },
    };
    return { ...styles[status], transition: 'all 0.2s', cursor: 'pointer' };
  };

  const calcularMetricas = () => {
    let vencidos = 0, porVencer = 0, stockBajo = 0;
    medicamentos.forEach(med => {
      const status = getRowStatus(med);
      if (status === 'vencido') vencidos++;
      else if (status === 'porVencer') porVencer++;
      if (med.stock_total <= med.stock_minimo) stockBajo++;
    });
    return { total: medicamentos.length, vencidos, porVencer, stockBajo };
  };

  const metricas = calcularMetricas();

  const medicamentosFiltrados = medicamentos.filter(med => {
    const matchBusqueda = med.nombre_comercial.toLowerCase().includes(busqueda.toLowerCase()) ||
                          med.principio_activo.toLowerCase().includes(busqueda.toLowerCase());
    if (!matchBusqueda) return false;
    const status = getRowStatus(med);
    if (filtroActivo === 'vencidos') return status === 'vencido';
    if (filtroActivo === 'porVencer') return status === 'porVencer';
    if (filtroActivo === 'stockBajo') return med.stock_total <= med.stock_minimo;
    return true;
  });

  const MetricCard = ({ icon, label, value, color, bgColor, borderColor, filterKey, isActive }) => (
    <div onClick={() => setFiltroActivo(filterKey)} style={{
      flex: 1, minWidth: '140px', padding: '16px', backgroundColor: bgColor, borderRadius: '12px',
      cursor: 'pointer', border: isActive ? `3px solid ${borderColor}` : '3px solid transparent',
      boxShadow: isActive ? `0 4px 15px ${borderColor}40` : '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>{label}</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color, margin: 0 }}>{value}</p>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${borderColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: borderColor, fontSize: '18px' }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: '#1976d2', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>📍 INVENTARIO</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <FiPackage color="#1976d2" /> Inventario de Medicamentos
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  style={{ padding: '10px 16px 10px 36px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', width: '180px' }} />
              </div>
              <button onClick={() => navigate('/medicamentos/new')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                <FiPlus /> Nuevo
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
          {/* Métricas */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <MetricCard icon={<FiBox />} label="Total" value={metricas.total} color="#3b82f6" bgColor="#eff6ff" borderColor="#3b82f6" filterKey="all" isActive={filtroActivo === 'all'} />
            <MetricCard icon={<FiAlertTriangle />} label="Vencidos" value={metricas.vencidos} color="#ef4444" bgColor="#fef2f2" borderColor="#ef4444" filterKey="vencidos" isActive={filtroActivo === 'vencidos'} />
            <MetricCard icon={<FiClock />} label="Por Vencer" value={metricas.porVencer} color="#f59e0b" bgColor="#fffbeb" borderColor="#f59e0b" filterKey="porVencer" isActive={filtroActivo === 'porVencer'} />
            <MetricCard icon={<FiAlertCircle />} label="Stock Bajo" value={metricas.stockBajo} color="#f97316" bgColor="#fff7ed" borderColor="#f97316" filterKey="stockBajo" isActive={filtroActivo === 'stockBajo'} />
          </div>

          {/* Filtro activo */}
          {filtroActivo !== 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '10px 16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <span style={{ color: '#0369a1', fontSize: '13px' }}>Mostrando <strong>{medicamentosFiltrados.length}</strong> productos</span>
              <button onClick={() => setFiltroActivo('all')} style={{ marginLeft: 'auto', padding: '6px 12px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Limpiar</button>
            </div>
          )}

          {/* Tabla */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Nombre</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Principio Activo</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Ubicación</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Precio</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Stock</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Lotes</th>
                </tr>
              </thead>
              <tbody>
                {medicamentosFiltrados.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No se encontraron medicamentos</td></tr>
                ) : (
                  medicamentosFiltrados.map((med) => {
                    const estado = getEstadoMedicamento(med);
                    const rowStatus = getRowStatus(med);
                    const stockBajo = med.stock_total <= med.stock_minimo;
                    const isHovered = hoveredRow === med.id;
                    const expanded = lotesExpandidos[med.id];

                    return (
                      <React.Fragment key={med.id}>
                        <tr style={getRowStyles(rowStatus, isHovered)} onMouseEnter={() => setHoveredRow(med.id)} onMouseLeave={() => setHoveredRow(null)} onClick={() => navigate(`/medicamentos/${med.id}`)}>
                          <td style={{ padding: '14px 16px', fontWeight: '500' }}>{med.nombre_comercial}</td>
                          <td style={{ padding: '14px 16px', color: '#666' }}>{med.principio_activo}</td>
                          <td style={{ padding: '14px 16px', color: '#666' }}>{med.ubicacion}</td>
                          <td style={{ padding: '14px 16px', fontWeight: '600' }}>S/ {med.precio_venta.toFixed(2)}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '600', color: stockBajo ? '#ef4444' : '#333' }}>{med.stock_total}</span>
                            {stockBajo && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#ef4444' }}>⚠️</span>}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ backgroundColor: estado.bg, color: estado.color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                              {estado.diasRestantes <= 0 ? 'VENCIDO' : estado.diasRestantes <= 30 ? `${estado.diasRestantes}d` : estado.diasRestantes <= 60 ? `${estado.diasRestantes}d` : 'OK'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <button onClick={(e) => { e.stopPropagation(); toggleLotes(med.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
                              {med.lotes.length} {expanded ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </td>
                        </tr>
                        {expanded && med.lotes.map(lote => {
                          const diasLote = calcularDiasRestantes(lote.fecha_vencimiento);
                          const estadoLote = getEstadoSemaforo(diasLote);
                          return (
                            <tr key={lote.id} style={{ backgroundColor: '#f9fafb' }}>
                              <td colSpan="2" style={{ padding: '10px 16px 10px 40px', fontSize: '12px', color: '#666' }}>Lote: <strong>{lote.codigo}</strong></td>
                              <td style={{ padding: '10px 16px', fontSize: '12px', color: '#666' }}>Cantidad: {lote.cantidad}</td>
                              <td style={{ padding: '10px 16px', fontSize: '12px', color: '#666' }}>Vence: {lote.fecha_vencimiento}</td>
                              <td colSpan="2" style={{ padding: '10px 16px' }}>
                                <span style={{ backgroundColor: estadoLote.bg, color: estadoLote.color, padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600' }}>
                                  {diasLote <= 0 ? 'VENCIDO' : `${diasLote} días`}
                                </span>
                              </td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MedicamentosList;
