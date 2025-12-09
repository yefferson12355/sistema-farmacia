/**
 * API Service - SIGFARMA
 * Servicio para comunicación con el backend
 * Actualmente usa datos mock, fácil de cambiar a API real
 */

import axios from 'axios';
import { 
  medicamentos, 
  getAlertasVencimiento, 
  getAlertasStock, 
  ventasHistorial,
  validarVenta 
} from '../data/mockData';

// Configuración base de axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// MODO: true = datos mock, false = API real
// ============================================
const USE_MOCK = true;

// ============================================
// USUARIOS DEL SISTEMA (Mock)
// ============================================
const usuarios = [
  { id: 1, username: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'admin', email: 'admin@sigfarma.com' },
  { id: 2, username: 'farmaceutico', password: 'farma123', nombre: 'Juan Pérez', rol: 'farmaceutico', email: 'juan@sigfarma.com' },
  { id: 3, username: 'vendedor', password: 'venta123', nombre: 'Ana Martínez', rol: 'vendedor', email: 'ana@sigfarma.com' },
  { id: 4, username: 'yefferson', password: '123456', nombre: 'Yefferson', rol: 'admin', email: 'yefferson@sigfarma.com' },
];

// ============================================
// AUTENTICACIÓN
// ============================================
export const login = async (username, password) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuario = usuarios.find(
          u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        
        if (usuario) {
          const { password: _, ...usuarioSinPassword } = usuario;
          const token = btoa(JSON.stringify({ userId: usuario.id, exp: Date.now() + 8 * 60 * 60 * 1000 }));
          resolve({ 
            success: true, 
            user: usuarioSinPassword,
            token: token
          });
        } else {
          reject(new Error('Credenciales incorrectas'));
        }
      }, 500);
    });
  }
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const logout = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  }
  const response = await api.post('/auth/logout');
  return response.data;
};

export const verificarToken = async (token) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp > Date.now()) {
          const usuario = usuarios.find(u => u.id === decoded.userId);
          if (usuario) {
            const { password: _, ...usuarioSinPassword } = usuario;
            resolve({ valid: true, user: usuarioSinPassword });
          } else {
            reject(new Error('Usuario no encontrado'));
          }
        } else {
          reject(new Error('Token expirado'));
        }
      } catch (e) {
        reject(new Error('Token inválido'));
      }
    });
  }
  const response = await api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ============================================
// MEDICAMENTOS
// ============================================
export const getMedicamentos = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(medicamentos), 300);
    });
  }
  const response = await api.get('/medicamentos');
  return response.data;
};

export const getMedicamentoById = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const med = medicamentos.find(m => m.id === parseInt(id));
      setTimeout(() => resolve(med), 200);
    });
  }
  const response = await api.get(`/medicamentos/${id}`);
  return response.data;
};

export const getLotesByMedicamento = async (medicamentoId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const med = medicamentos.find(m => m.id === parseInt(medicamentoId));
      setTimeout(() => resolve(med?.lotes || []), 200);
    });
  }
  const response = await api.get(`/medicamentos/${medicamentoId}/lotes`);
  return response.data;
};

export const buscarMedicamentos = async (query) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const resultados = medicamentos.filter(m => 
        m.nombre_comercial.toLowerCase().includes(query.toLowerCase()) ||
        m.principio_activo.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => resolve(resultados), 200);
    });
  }
  const response = await api.get(`/medicamentos/buscar?q=${query}`);
  return response.data;
};

export const crearMedicamento = async (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const nuevo = { ...data, id: medicamentos.length + 1 };
      medicamentos.push(nuevo);
      setTimeout(() => resolve(nuevo), 300);
    });
  }
  const response = await api.post('/medicamentos', data);
  return response.data;
};

// ============================================
// ALERTAS
// ============================================
export const getAlertasVencimientoAPI = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getAlertasVencimiento()), 300);
    });
  }
  const response = await api.get('/alertas/vencimiento');
  return response.data;
};

export const getAlertasStockAPI = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getAlertasStock()), 300);
    });
  }
  const response = await api.get('/alertas/stock');
  return response.data;
};

// ============================================
// VENTAS
// ============================================
export const getVentasHistorial = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(ventasHistorial), 300);
    });
  }
  const response = await api.get('/ventas');
  return response.data;
};

export const procesarVenta = async (ventaData) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      // Validar cada producto del carrito
      for (const item of ventaData.productos) {
        const validacion = validarVenta(item.lote);
        if (!validacion.permitido) {
          reject(new Error(validacion.mensaje));
          return;
        }
      }
      
      const nuevaVenta = {
        id: ventasHistorial.length + 1,
        fecha: new Date().toISOString().split('T')[0],
        ...ventaData,
      };
      ventasHistorial.unshift(nuevaVenta);
      setTimeout(() => resolve(nuevaVenta), 500);
    });
  }
  const response = await api.post('/ventas', ventaData);
  return response.data;
};

export const validarProductoParaVenta = (lote) => {
  return validarVenta(lote);
};

// ============================================
// REPORTES
// ============================================
export const getReporteVentas = async (fechaInicio, fechaFin) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const ventas = ventasHistorial.filter(v => 
        v.fecha >= fechaInicio && v.fecha <= fechaFin
      );
      setTimeout(() => resolve(ventas), 300);
    });
  }
  const response = await api.get(`/reportes/ventas?inicio=${fechaInicio}&fin=${fechaFin}`);
  return response.data;
};

export const getReporteInventario = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const reporte = medicamentos.map(m => ({
        ...m,
        valor_total: m.stock_total * m.precio_venta,
      }));
      setTimeout(() => resolve(reporte), 300);
    });
  }
  const response = await api.get('/reportes/inventario');
  return response.data;
};

export const getReporteAlertas = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const alertas = {
        vencimiento: getAlertasVencimiento(),
        stock: getAlertasStock()
      };
      setTimeout(() => resolve(alertas), 300);
    });
  }
  const response = await api.get('/reportes/alertas');
  return response.data;
};

export const getReportePrincipioActivo = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const reportePA = medicamentos.map(m => ({
        principio_activo: m.principio_activo,
        nombre_comercial: m.nombre_comercial,
        stock: m.stock_total,
        precio: m.precio_venta,
        valor_total: m.stock_total * m.precio_venta
      })).sort((a, b) => b.valor_total - a.valor_total);
      setTimeout(() => resolve(reportePA), 300);
    });
  }
  const response = await api.get('/reportes/principio-activo');
  return response.data;
};

export const getReporteClientes = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const clientes = {};
      ventasHistorial.forEach(venta => {
        if (!clientes[venta.cliente_dni]) {
          clientes[venta.cliente_dni] = {
            dni: venta.cliente_dni,
            nombre: venta.cliente_nombre,
            totalCompras: 0,
            cantidadTransacciones: 0,
            ultimaCompra: venta.fecha
          };
        }
        clientes[venta.cliente_dni].totalCompras += venta.total;
        clientes[venta.cliente_dni].cantidadTransacciones++;
        clientes[venta.cliente_dni].ultimaCompra = venta.fecha;
      });
      const reporteClientes = Object.values(clientes).sort((a, b) => b.totalCompras - a.totalCompras);
      setTimeout(() => resolve(reporteClientes), 300);
    });
  }
  const response = await api.get('/reportes/clientes');
  return response.data;
};

export const getReporteProductosMasVendidos = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const productosMasVendidos = {};
      ventasHistorial.forEach(venta => {
        venta.productos.forEach(prod => {
          if (!productosMasVendidos[prod.nombre]) {
            productosMasVendidos[prod.nombre] = {
              nombre: prod.nombre,
              cantidadVendida: 0,
              ingresos: 0
            };
          }
          productosMasVendidos[prod.nombre].cantidadVendida += prod.cantidad;
          productosMasVendidos[prod.nombre].ingresos += prod.cantidad * prod.precio_unitario;
        });
      });
      const reporte = Object.values(productosMasVendidos)
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, 10);
      setTimeout(() => resolve(reporte), 300);
    });
  }
  const response = await api.get('/reportes/productos-mas-vendidos');
  return response.data;
};

export default api;
