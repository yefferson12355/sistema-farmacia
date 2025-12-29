/**
 * API Service - SIGFARMA
 * Conexión TOTAL Backend <-> Frontend
 */
import axios from 'axios';
import {
  medicamentos as mockMedicamentos,
  getAlertasVencimiento as mockAlertasVencimiento,
  getAlertasStock as mockAlertasStock,
  validarVenta
} from '../data/mockData';

// 1. CONFIGURACIÓN
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCK = false; // Forzamos a FALSE para usar el backend real

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sigfarma_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// ============================================
// 2. AUTENTICACIÓN (REAL)
// ============================================
export const login = async (username, password) => {
  if (USE_MOCK) return Promise.resolve({ success: true, user: { username: 'admin' }, token: 'mock' });

  try {
    const { data } = await api.post('/auth/login', { username, password });
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error de conexión o credenciales');
  }
};

export const logout = async () => ({ success: true });
export const verificarToken = async (token) => ({ valid: true });

// ============================================
// 3. MEDICAMENTOS E INVENTARIO (REAL)
// ============================================
export const getMedicamentos = async () => {
  if (USE_MOCK) return Promise.resolve(mockMedicamentos);
  const { data } = await api.get('/medicamentos');
  return data;
};

export const getMedicamentoById = async (id) => {
  if (USE_MOCK) return Promise.resolve(mockMedicamentos[0]);
  const { data } = await api.get(`/medicamentos/${id}`);
  return data;
};

export const crearMedicamento = async (data) => {
  if (USE_MOCK) return Promise.resolve(data);
  try {
    const { data: resp } = await api.post('/medicamentos', data);
    return resp;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al crear');
  }
};

export const buscarMedicamentos = async (query) => {
  const { data } = await api.get('/medicamentos');
  return data.filter(m => m.nombre_comercial.toLowerCase().includes(query.toLowerCase()));
};

export const getLotesByMedicamento = async (id) => {
    try {
        const { data } = await api.get(`/medicamentos/${id}`);
        return data.lotes || [];
    } catch (e) { return []; }
};

// ============================================
// 4. ALERTAS Y KPIs (REALES)
// ============================================

export const getAlertasVencimientoAPI = async () => {
  if (USE_MOCK) return Promise.resolve(mockAlertasVencimiento());

  const { data } = await api.get('/alertas/vencimiento');
  return data.map(item => ({
    id: item.lote_id,
    medicamento: item.nombre_comercial,
    lote: item.numero_lote,
    fecha_vencimiento: item.fecha_vencimiento,
    dias_restantes: Math.ceil((new Date(item.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24)),
    estado: item.estado_vencimiento,
    stock: item.stock_actual
  }));
};

export const getAlertasStockAPI = async () => {
  if (USE_MOCK) return Promise.resolve(mockAlertasStock());
  
  const { data } = await api.get('/alertas/stock');
  return data.map(item => ({
    id: item.id,
    medicamento: item.nombre_comercial,
    stock_actual: Number(item.stock_total),
    stock_minimo: item.stock_minimo,
    deficit: item.stock_minimo - item.stock_total
  }));
};

// ============================================
// 5. VENTAS Y TRANSACCIONES
// ============================================
export const procesarVenta = async (ventaData) => {
  if (USE_MOCK) return Promise.resolve({ id: 123 });

  const payload = {
    usuario_id: ventaData.usuario_id || 1, 
    cliente_dni: ventaData.cliente_dni || '12345678',
    metodo_pago: ventaData.metodoPago || 'Efectivo',
    // IMPORTANTE: NO enviamos precio_unit, el backend lo busca
    items: ventaData.productos.map(p => ({
      lote_id: p.lote.id,
      cantidad: Number(p.cantidad)
    })),
    cliente_nombre: ventaData.cliente_nombre // Enviamos nombre para crearlo si no existe
  };

  const { data } = await api.post('/ventas', payload);
  return data;
};

export const validarProductoParaVenta = (lote) => validarVenta(lote);

// ✅ FUNCIÓN CORREGIDA: Ahora sí conecta con el endpoint GET del backend
export const getVentasHistorial = async () => {
  if (USE_MOCK) return []; 
  try {
    const { data } = await api.get('/ventas');
    
    return data.map(v => ({
      id: v.id,
      fecha: new Date(v.created_at).toLocaleDateString('es-PE'),
      hora: new Date(v.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      cliente: v.cliente_nombre,
      dni: v.cliente_dni,
      vendedor: v.vendedor_nombre,
      total: Number(v.total),
      metodoPago: v.metodo_pago,
      productos: [] 
    }));
  } catch (error) {
    console.error("Error cargando ventas:", error);
    return [];
  }
};

// ============================================
// 6. REPORTES (Integrados con datos reales)
// ============================================
export const getReporteInventario = async () => {
  if (!USE_MOCK) {
     const data = await getMedicamentos();
     return data.map(m => ({ 
        ...m, valor_total: (m.stock_total || 0) * Number(m.precio_venta) 
     }));
  }
  return [];
};

export const getReporteAlertas = async () => {
  const [vencimiento, stock] = await Promise.all([
    getAlertasVencimientoAPI(),
    getAlertasStockAPI()
  ]);
  return { vencimiento, stock };
};

export const getReporteVentas = async () => [];
export const getReportePrincipioActivo = async () => [];
export const getReporteClientes = async () => [];
export const getReporteProductosMasVendidos = async () => [];

export default api;