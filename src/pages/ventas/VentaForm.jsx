/**
 * VentaForm.jsx
 * Módulo: PUNTO DE VENTA (POS) - PROFESIONAL
 * Sistema completo con validación dual, recetas, métodos de pago y sidebar
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiShoppingCart, FiSearch, FiTrash2, FiAlertTriangle, 
  FiCheck, FiAlertCircle, FiDollarSign, FiUser, FiCreditCard
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { buscarMedicamentos, validarProductoParaVenta, procesarVenta } from '../../services/api';
import { calcularDiasRestantes, getEstadoSemaforo, clientes } from '../../data/mockData';

function VentaForm() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clienteDNI, setClienteDNI] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [recetaMedica, setRecetaMedica] = useState('');
  const [vendedor, setVendedor] = useState('Admin');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState({ tipo: '', titulo: '', mensaje: '' });
  const [loading, setLoading] = useState(false);

  // Auto-completar nombre cuando se ingresa DNI
  useEffect(() => {
    if (clienteDNI.length === 8) {
      const clienteEncontrado = clientes.find(c => c.dni === clienteDNI);
      if (clienteEncontrado) {
        setClienteNombre(clienteEncontrado.nombre);
      } else {
        setClienteNombre('');
      }
    }
  }, [clienteDNI]);

  const buscarProductos = useCallback(async () => {
    try {
      const data = await buscarMedicamentos(busqueda);
      setResultados(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  }, [busqueda]);

  useEffect(() => {
    if (busqueda.length >= 2) {
      buscarProductos();
    } else {
      setResultados([]);
    }
  }, [busqueda, buscarProductos]);

  const agregarAlCarrito = (medicamento, lote) => {
    // VALIDACIÓN CRÍTICA - Bloqueo de productos vencidos
    const validacion = validarProductoParaVenta(lote);
    
    if (!validacion.permitido) {
      setMensajeModal({
        tipo: 'error',
        titulo: '🚫 VENTA BLOQUEADA',
        mensaje: validacion.mensaje,
        detalle: `Este producto vence en ${validacion.diasRestantes} días. Por seguridad del paciente, no se puede vender.`
      });
      setMostrarModal(true);
      return;
    }

    // Verificar si requiere receta
    if (medicamento.requiere_receta && !recetaMedica) {
      setMensajeModal({
        tipo: 'warning',
        titulo: '⚠️ Receta Requerida',
        mensaje: 'Este medicamento requiere receta médica.',
        detalle: 'Por favor ingrese el número de receta antes de agregar este producto.'
      });
      setMostrarModal(true);
      return;
    }

    // Verificar si ya está en el carrito
    const existente = carrito.find(item => item.lote.id === lote.id);
    if (existente) {
      setCarrito(carrito.map(item => 
        item.lote.id === lote.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        medicamento,
        lote,
        cantidad: 1,
        subtotal: medicamento.precio_venta
      }]);
    }

    setBusqueda('');
    setResultados([]);
  };

  const eliminarDelCarrito = (loteId) => {
    setCarrito(carrito.filter(item => item.lote.id !== loteId));
  };

  const actualizarCantidad = (loteId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(carrito.map(item => 
      item.lote.id === loteId
        ? { ...item, cantidad: nuevaCantidad, subtotal: item.medicamento.precio_venta * nuevaCantidad }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.medicamento.precio_venta * item.cantidad), 0);
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      setMensajeModal({
        tipo: 'warning',
        titulo: 'Carrito Vacío',
        mensaje: 'Agregue productos al carrito antes de procesar la venta.'
      });
      setMostrarModal(true);
      return;
    }

    if (!clienteDNI || clienteDNI.length !== 8) {
      setMensajeModal({
        tipo: 'warning',
        titulo: 'DNI Inválido',
        mensaje: 'Por favor ingrese un DNI válido (8 dígitos).'
      });
      setMostrarModal(true);
      return;
    }

    // Verificar si algún producto requiere receta y no se ha ingresado
    const requiereReceta = carrito.some(item => item.medicamento.requiere_receta);
    if (requiereReceta && !recetaMedica) {
      setMensajeModal({
        tipo: 'warning',
        titulo: 'Receta Requerida',
        mensaje: 'Uno o más productos requieren receta médica. Por favor ingrese el número de receta.'
      });
      setMostrarModal(true);
      return;
    }

    setLoading(true);
    try {
      await procesarVenta({
        cliente_dni: clienteDNI,
        cliente_nombre: clienteNombre || 'Cliente Anónimo',
        receta_medica: recetaMedica || 'N/A',
        productos: carrito,
        total: calcularTotal(),
        vendedor: vendedor,
        metodoPago: metodoPago
      });

      setMensajeModal({
        tipo: 'success',
        titulo: '✅ Venta Exitosa',
        mensaje: `Venta procesada correctamente.\nCliente: ${clienteNombre || clienteDNI}\nTotal: S/ ${calcularTotal().toFixed(2)}`
      });
      setMostrarModal(true);
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setCarrito([]);
        setClienteDNI('');
        setClienteNombre('');
        setRecetaMedica('');
        setMostrarModal(false);
      }, 2000);
    } catch (error) {
      setMensajeModal({
        tipo: 'error',
        titulo: 'Error en Venta',
        mensaje: error.message
      });
      setMostrarModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* Modal de Alertas */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            maxWidth: '450px', 
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            borderTop: `4px solid ${mensajeModal.tipo === 'error' ? '#ef4444' : mensajeModal.tipo === 'warning' ? '#f59e0b' : '#22c55e'}`
          }}>
            <div style={{ textAlign: 'center' }}>
              {mensajeModal.tipo === 'error' && <FiAlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />}
              {mensajeModal.tipo === 'warning' && <FiAlertCircle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />}
              {mensajeModal.tipo === 'success' && <FiCheck size={48} color="#22c55e" style={{ marginBottom: '16px' }} />}
              
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>
                {mensajeModal.titulo}
              </h2>
              <p style={{ color: '#666', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{mensajeModal.mensaje}</p>
              {mensajeModal.detalle && (
                <p style={{ color: '#999', fontSize: '13px', marginBottom: '24px' }}>{mensajeModal.detalle}</p>
              )}
              <button
                onClick={() => setMostrarModal(false)}
                style={{ 
                  padding: '12px 32px', 
                  backgroundColor: mensajeModal.tipo === 'error' ? '#ef4444' : mensajeModal.tipo === 'warning' ? '#f59e0b' : '#22c55e',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Principal */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Panel Izquierdo - Búsqueda y Productos */}
        <div style={{ flex: 1, padding: '24px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <FiShoppingCart color="#22c55e" /> Punto de Venta
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
              Busca, selecciona productos y procesa ventas
            </p>
          </div>

          {/* Buscador */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Buscar medicamento o escanear código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
            />
          </div>

          {/* Resultados de búsqueda */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {resultados.length > 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {resultados.map(med => (
                  <div key={med.id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: '600' }}>{med.nombre_comercial}</span>
                        {med.requiere_receta && (
                          <span style={{ marginLeft: '8px', padding: '2px 8px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
                            ℞ RECETA
                          </span>
                        )}
                      </div>
                      <span style={{ fontWeight: '700', color: '#22c55e', fontSize: '16px' }}>S/ {med.precio_venta.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                      {med.principio_activo} • Stock: <strong>{med.stock_total}</strong>
                    </div>
                    
                    {/* Lotes disponibles */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {med.lotes.map(lote => {
                        const dias = calcularDiasRestantes(lote.fecha_vencimiento);
                        const estado = getEstadoSemaforo(dias);
                        const bloqueado = dias <= 30;
                        
                        return (
                          <button
                            key={lote.id}
                            onClick={() => agregarAlCarrito(med, lote)}
                            disabled={bloqueado}
                            style={{ 
                              padding: '8px 12px', 
                              backgroundColor: bloqueado ? '#fee2e2' : '#f0fdf4',
                              border: `2px solid ${estado.color}`,
                              borderRadius: '8px', 
                              cursor: bloqueado ? 'not-allowed' : 'pointer',
                              fontSize: '11px',
                              fontWeight: '600',
                              opacity: bloqueado ? 0.6 : 1,
                              transition: 'all 0.2s'
                            }}
                          >
                            <div>{lote.codigo}</div>
                            <div style={{ fontSize: '10px', opacity: 0.8 }}>{dias} días</div>
                            {bloqueado && <div style={{ color: '#ef4444' }}>🚫</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : busqueda ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <FiSearch size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <FiSearch size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p>Comienza a buscar productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho - Carrito y Datos del Cliente */}
        <div style={{ width: '420px', backgroundColor: 'white', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {/* Header Carrito */}
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FiShoppingCart /> Carrito ({carrito.length})
          </h2>

          {/* Items del carrito */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px' }}>
            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#999' }}>
                <FiShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p>Carrito vacío</p>
                <p style={{ fontSize: '12px' }}>Busque y agregue productos</p>
              </div>
            ) : (
              carrito.map(item => (
                <div key={item.lote.id} style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a2e' }}>{item.medicamento.nombre_comercial}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Lote: {item.lote.codigo}</div>
                    </div>
                    <button 
                      onClick={() => eliminarDelCarrito(item.lote.id)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        onClick={() => actualizarCantidad(item.lote.id, item.cantidad - 1)} 
                        style={{ width: '24px', height: '24px', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white', fontSize: '12px', fontWeight: '600' }}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button 
                        onClick={() => actualizarCantidad(item.lote.id, item.cantidad + 1)} 
                        style={{ width: '24px', height: '24px', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white', fontSize: '12px', fontWeight: '600' }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: '700', color: '#22c55e', fontSize: '13px' }}>S/ {(item.medicamento.precio_venta * item.cantidad).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Datos del Cliente */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiUser size={14} /> Cliente
            </h3>
            <input
              type="text"
              placeholder="DNI (8 dígitos)"
              value={clienteDNI}
              onChange={(e) => setClienteDNI(e.target.value.replace(/\D/g, '').substring(0, 8))}
              maxLength="8"
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', marginBottom: '8px' }}
            />
            {clienteNombre && (
              <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#22c55e', marginBottom: '8px' }}>
                ✓ {clienteNombre}
              </div>
            )}
          </div>

          {/* Receta Médica */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>℞ Receta (si aplica)</h3>
            <input
              type="text"
              placeholder="Nº Receta Médica"
              value={recetaMedica}
              onChange={(e) => setRecetaMedica(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }}
            />
          </div>

          {/* Vendedor y Método de Pago */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>Vendedor</h3>
              <select
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }}
              >
                <option>Admin</option>
                <option>Juan Pérez</option>
                <option>Ana Martínez</option>
              </select>
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCreditCard size={12} /> Pago
              </h3>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }}
              >
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>
          </div>

          {/* Total */}
          <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>TOTAL:</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiDollarSign size={20} /> {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botón Procesar */}
          <button
            onClick={finalizarVenta}
            disabled={loading || carrito.length === 0 || !clienteDNI}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: (carrito.length === 0 || !clienteDNI) ? '#e5e7eb' : '#22c55e',
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '700',
              cursor: (carrito.length === 0 || !clienteDNI) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Procesando...' : '✓ PROCESAR VENTA'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default VentaForm;
