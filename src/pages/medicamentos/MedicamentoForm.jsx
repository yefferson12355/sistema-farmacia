/**
 * MedicamentoForm.jsx
 * Módulo: FORMULARIO DE MEDICAMENTOS
 * Crear y editar medicamentos con validación completa
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiPackage, FiArrowLeft, FiSave, FiX, FiPlus, FiTrash2,
  FiCheckCircle
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { getMedicamentoById, crearMedicamento } from '../../services/api';

function MedicamentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nombre_comercial: '',
    principio_activo: '',
    ubicacion: '',
    precio_venta: '',
    stock_total: '',
    stock_minimo: '',
    requiere_receta: false,
    lotes: []
  });

  const [nuevoLote, setNuevoLote] = useState({
    codigo: '',
    cantidad: '',
    fecha_vencimiento: ''
  });

  const cargarMedicamento = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMedicamentoById(id);
      if (data) {
        setFormData({
          nombre_comercial: data.nombre_comercial || '',
          principio_activo: data.principio_activo || '',
          ubicacion: data.ubicacion || '',
          precio_venta: data.precio_venta?.toString() || '',
          stock_total: data.stock_total?.toString() || '',
          stock_minimo: data.stock_minimo?.toString() || '',
          requiere_receta: data.requiere_receta || false,
          lotes: data.lotes || []
        });
      }
    } catch (error) {
      console.error('Error al cargar medicamento:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      cargarMedicamento();
    }
  }, [isEditing, cargarMedicamento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLoteChange = (e) => {
    const { name, value } = e.target;
    setNuevoLote(prev => ({ ...prev, [name]: value }));
  };

  const agregarLote = () => {
    if (!nuevoLote.codigo || !nuevoLote.cantidad || !nuevoLote.fecha_vencimiento) {
      alert('Complete todos los campos del lote');
      return;
    }
    
    const lote = {
      id: Date.now(),
      codigo: nuevoLote.codigo.toUpperCase(),
      cantidad: parseInt(nuevoLote.cantidad),
      fecha_vencimiento: nuevoLote.fecha_vencimiento,
      estado: 'vigente'
    };
    
    setFormData(prev => ({
      ...prev,
      lotes: [...prev.lotes, lote],
      stock_total: (parseInt(prev.stock_total || 0) + lote.cantidad).toString()
    }));
    
    setNuevoLote({ codigo: '', cantidad: '', fecha_vencimiento: '' });
  };

  const eliminarLote = (loteId) => {
    const loteAEliminar = formData.lotes.find(l => l.id === loteId);
    setFormData(prev => ({
      ...prev,
      lotes: prev.lotes.filter(l => l.id !== loteId),
      stock_total: Math.max(0, parseInt(prev.stock_total || 0) - (loteAEliminar?.cantidad || 0)).toString()
    }));
  };

  const validarFormulario = () => {
    const newErrors = {};
    
    if (!formData.nombre_comercial.trim()) {
      newErrors.nombre_comercial = 'El nombre comercial es requerido';
    }
    if (!formData.principio_activo.trim()) {
      newErrors.principio_activo = 'El principio activo es requerido';
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }
    if (!formData.precio_venta || parseFloat(formData.precio_venta) <= 0) {
      newErrors.precio_venta = 'Ingrese un precio válido';
    }
    if (!formData.stock_minimo || parseInt(formData.stock_minimo) < 0) {
      newErrors.stock_minimo = 'Ingrese un stock mínimo válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        precio_venta: parseFloat(formData.precio_venta),
        stock_total: parseInt(formData.stock_total) || 0,
        stock_minimo: parseInt(formData.stock_minimo)
      };
      
      await crearMedicamento(dataToSave);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/medicamentos');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el medicamento');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (error) => ({
    width: '100%',
    padding: '12px 16px',
    border: error ? '2px solid #ef4444' : '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  });

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: '#666' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />

      {/* Modal de Éxito */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <FiCheckCircle size={64} color="#22c55e" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: '#333', marginBottom: '8px' }}>¡Guardado Exitosamente!</h2>
            <p style={{ color: '#666' }}>Redirigiendo al inventario...</p>
          </div>
        </div>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => navigate('/medicamentos')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#374151' }}>
              <FiArrowLeft /> Volver
            </button>
            <span style={{ backgroundColor: '#22c55e', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
              {isEditing ? '✏️ EDITAR' : '➕ NUEVO'}
            </span>
          </div>
          
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiPackage color="#1976d2" />
            {isEditing ? 'Editar Medicamento' : 'Registrar Nuevo Medicamento'}
          </h1>
        </div>

        {/* Form Content */}
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Columna Izquierda - Información Básica */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  Información del Medicamento
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Nombre Comercial *</label>
                    <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleChange} style={inputStyle(errors.nombre_comercial)} placeholder="Ej: Paracetamol 500mg" />
                    {errors.nombre_comercial && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.nombre_comercial}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Principio Activo *</label>
                    <input type="text" name="principio_activo" value={formData.principio_activo} onChange={handleChange} style={inputStyle(errors.principio_activo)} placeholder="Ej: Paracetamol" />
                    {errors.principio_activo && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.principio_activo}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Ubicación *</label>
                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} style={inputStyle(errors.ubicacion)} placeholder="Ej: Estante A-1" />
                    {errors.ubicacion && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.ubicacion}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Precio de Venta (S/) *</label>
                      <input type="number" name="precio_venta" value={formData.precio_venta} onChange={handleChange} style={inputStyle(errors.precio_venta)} placeholder="0.00" step="0.01" min="0" />
                      {errors.precio_venta && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.precio_venta}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Stock Mínimo *</label>
                      <input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} style={inputStyle(errors.stock_minimo)} placeholder="0" min="0" />
                      {errors.stock_minimo && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.stock_minimo}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <input type="checkbox" name="requiere_receta" checked={formData.requiere_receta} onChange={handleChange} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>Requiere Receta Médica</label>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>Marcar si el medicamento necesita prescripción</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Lotes */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  Gestión de Lotes
                </h3>
                
                {/* Agregar Nuevo Lote */}
                <div style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1', marginBottom: '12px' }}>Agregar Nuevo Lote</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Código</label>
                      <input type="text" name="codigo" value={nuevoLote.codigo} onChange={handleLoteChange} style={{ ...inputStyle(), padding: '10px 12px' }} placeholder="L-2025-001" />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Cantidad</label>
                      <input type="number" name="cantidad" value={nuevoLote.cantidad} onChange={handleLoteChange} style={{ ...inputStyle(), padding: '10px 12px' }} placeholder="0" min="1" />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Vencimiento</label>
                      <input type="date" name="fecha_vencimiento" value={nuevoLote.fecha_vencimiento} onChange={handleLoteChange} style={{ ...inputStyle(), padding: '10px 12px' }} />
                    </div>
                    <button type="button" onClick={agregarLote} style={{ padding: '10px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', height: '42px' }}>
                      <FiPlus /> Agregar
                    </button>
                  </div>
                </div>

                {/* Lista de Lotes */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Lotes Registrados</p>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                      Stock Total: {formData.stock_total || 0}
                    </span>
                  </div>
                  
                  {formData.lotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#9ca3af' }}>
                      <FiPackage size={32} style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0 }}>No hay lotes registrados</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Agregue lotes usando el formulario de arriba</p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {formData.lotes.map(lote => (
                        <div key={lote.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1976d2', margin: 0 }}>{lote.codigo}</p>
                              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>Lote</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>{lote.cantidad} uds</p>
                              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>Cantidad</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>{lote.fecha_vencimiento}</p>
                              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>Vencimiento</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => eliminarLote(lote.id)} style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => navigate('/medicamentos')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                <FiX /> Cancelar
              </button>
              <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px', backgroundColor: saving ? '#9ca3af' : '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px' }}>
                <FiSave /> {saving ? 'Guardando...' : 'Guardar Medicamento'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default MedicamentoForm;
