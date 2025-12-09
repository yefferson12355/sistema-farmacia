import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiEye,
  FiDownload,
  FiFilter,
  FiList,
  FiShoppingCart,
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getVentasHistorial } from '../../services/api';
import { ventasHistorial as VENTAS_MOCK } from '../../data/mockData';

/**
 * VentasHistorial
 * Historial completo de ventas con filtros, detalle y exportación
 */

function VentasHistorial() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState({ fechaDesde: '', fechaHasta: '', vendedor: '', busqueda: '' });
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const data = await getVentasHistorial();
        setVentas(data || VENTAS_MOCK);
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        // Usar datos de fallback
        setVentas(VENTAS_MOCK);
      } finally {
        setLoading(false);
      }
    };
    cargarVentas();
  }, []);

  const ventasFiltradas = ventas.filter(venta => {
    if (filtro.busqueda) {
      const search = filtro.busqueda.toLowerCase();
      const cliente = (venta.cliente_nombre || venta.cliente || '').toLowerCase();
      const ventaId = String(venta.id || '').toLowerCase();
      const dni = (venta.cliente_dni || venta.dni || '');
      
      if (!cliente.includes(search) && 
          !ventaId.includes(search) &&
          !dni.includes(search)) {
        return false;
      }
    }
    if (filtro.fechaDesde && venta.fecha < filtro.fechaDesde) return false;
    if (filtro.fechaHasta && venta.fecha > filtro.fechaHasta) return false;
    if (filtro.vendedor && venta.vendedor !== filtro.vendedor) return false;
    return true;
  });

  const totalVentas = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);

  const handleVerDetalle = (venta) => {
    setVentaSeleccionada(venta);
  };

  const handleExportarTicket = (venta) => {
    // Generar contenido del ticket
    const productos = venta.productos || venta.items || [];
    const cliente = venta.cliente_nombre || venta.cliente || 'Cliente General';
    const dni = venta.cliente_dni || venta.dni || '-';
    
    let ticketContent = `
╔════════════════════════════════════════╗
║           SIGFARMA - TICKET            ║
║      Sistema de Gestión Farmacéutica   ║
╠════════════════════════════════════════╣
║  Venta #${venta.id}                              
║  Fecha: ${venta.fecha} ${venta.hora || '09:00'}        
║  Vendedor: ${venta.vendedor}                  
╠════════════════════════════════════════╣
║  Cliente: ${cliente}
║  DNI: ${dni}
╠════════════════════════════════════════╣
║  PRODUCTOS:
`;
    
    productos.forEach(item => {
      const nombre = item.nombre || item.medicamento;
      const precio = item.precio_unitario || item.precio || 0;
      const subtotal = item.cantidad * precio;
      ticketContent += `║  ${item.cantidad}x ${nombre}\n`;
      ticketContent += `║     S/ ${precio.toFixed(2)} c/u = S/ ${subtotal.toFixed(2)}\n`;
    });
    
    ticketContent += `╠════════════════════════════════════════╣
║  TOTAL: S/ ${venta.total.toFixed(2)}
║  Método: ${venta.metodoPago || 'Efectivo'}
╚════════════════════════════════════════╝
    ¡Gracias por su compra!
`;

    // Crear blob y descargar
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_venta_${venta.id}_${venta.fecha}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <FiList style={{ color: '#22c55e' }} />
              Historial de Ventas
            </h1>
            <p style={{ margin: '4px 0 0', color: '#666' }}>
              Consulta y gestión de todas las transacciones
            </p>
          </div>
          <button
            onClick={() => navigate('/ventas/nueva')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Nueva Venta
          </button>
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
            <FiFilter />
            <span style={{ fontWeight: '500' }}>Filtros:</span>
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Buscar</label>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="ID, cliente o DNI..."
                value={filtro.busqueda}
                onChange={(e) => setFiltro({ ...filtro, busqueda: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 36px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Desde</label>
            <input
              type="date"
              value={filtro.fechaDesde}
              onChange={(e) => setFiltro({ ...filtro, fechaDesde: e.target.value })}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Hasta</label>
            <input
              type="date"
              value={filtro.fechaHasta}
              onChange={(e) => setFiltro({ ...filtro, fechaHasta: e.target.value })}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Vendedor</label>
            <select
              value={filtro.vendedor}
              onChange={(e) => setFiltro({ ...filtro, vendedor: e.target.value })}
              style={{
                padding: '10px 30px 10px 10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Todos</option>
              <option value="Juan Pérez">Juan Pérez</option>
              <option value="Ana Martínez">Ana Martínez</option>
            </select>
          </div>

          <button
            onClick={() => setFiltro({ fechaDesde: '', fechaHasta: '', vendedor: '', busqueda: '' })}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666'
            }}
          >
            Limpiar
          </button>
        </div>

        {/* Resumen */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #22c55e'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Ventas</p>
            <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
              S/ {totalVentas.toFixed(2)}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Transacciones</p>
            <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
              {ventasFiltradas.length}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Promedio/Venta</p>
            <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              S/ {ventasFiltradas.length > 0 ? (totalVentas / ventasFiltradas.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Tabla de Ventas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            backgroundColor: '#22c55e',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiList />
              Registro de Ventas ({ventasFiltradas.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Cargando historial...
            </div>
          ) : ventasFiltradas.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No se encontraron ventas con los filtros aplicados.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Fecha / Hora</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Cliente</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Vendedor</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Tipo</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Total</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#3b82f6' }}>
                      #{venta.id}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <p style={{ margin: 0, color: '#1a1a2e' }}>{venta.fecha}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>{venta.hora || '09:00'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '500', color: '#1a1a2e' }}>{venta.cliente_nombre || venta.cliente || 'Cliente'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>DNI: {venta.cliente_dni || venta.dni || '-'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#666' }}>
                      {venta.vendedor}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: venta.tipoVenta === 'Con Receta' ? '#fef3c7' : '#dcfce7',
                        color: venta.tipoVenta === 'Con Receta' ? '#d97706' : '#16a34a'
                      }}>
                        {venta.tipoVenta || 'Normal'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#22c55e', fontSize: '16px' }}>
                      S/ {venta.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleVerDetalle(venta)}
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
                            fontSize: '12px'
                          }}
                          title="Ver Detalle"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => handleExportarTicket(venta)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          title="Descargar Ticket"
                        >
                          <FiDownload size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Detalle */}
        {ventaSeleccionada && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: '16px 16px 0 0'
              }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiShoppingCart />
                  Detalle de Venta {ventaSeleccionada.id}
                </h3>
                <button
                  onClick={() => setVentaSeleccionada(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ padding: '20px' }}>
                {/* Info General */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Fecha</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.fecha} - {ventaSeleccionada.hora || '09:00'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Vendedor</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.vendedor}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Cliente</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.cliente_nombre || ventaSeleccionada.cliente || 'Cliente'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>DNI</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.cliente_dni || ventaSeleccionada.dni || '-'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Tipo</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.tipoVenta || 'Normal'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Método de Pago</p>
                    <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{ventaSeleccionada.metodoPago}</p>
                  </div>
                </div>

                {/* Items */}
                <h4 style={{ margin: '0 0 12px', color: '#374151' }}>Productos</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Medicamento</th>
                      <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px' }}>Cant.</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px' }}>Precio</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(ventaSeleccionada.productos || ventaSeleccionada.items || []).map((item, idx) => {
                      const nombre = item.nombre || item.medicamento;
                      const precio = item.precio_unitario || item.precio || 0;
                      const subtotal = item.cantidad * precio;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px' }}>
                            {nombre}
                            {item.requiereReceta && (
                              <span style={{
                                marginLeft: '8px',
                                padding: '2px 6px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                borderRadius: '4px',
                                fontSize: '10px'
                              }}>
                                Receta
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{item.cantidad}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>S/ {precio.toFixed(2)}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500' }}>S/ {subtotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#dcfce7' }}>
                      <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>TOTAL:</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#16a34a' }}>
                        S/ {ventaSeleccionada.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleExportarTicket(ventaSeleccionada)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <FiDownload />
                    Descargar Ticket
                  </button>
                  <button
                    onClick={() => setVentaSeleccionada(null)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default VentasHistorial;
