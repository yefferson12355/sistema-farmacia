// dbSchema.js (Simulación de estructura y datos de base de datos SIGFARMA)
// Este archivo simula la estructura de tablas, relaciones y datos iniciales (seeding) de PostgreSQL para el backend.

const dbSchema = {
  Rol: [
    { id_rol: 1, nombre_rol: 'Administrador' },
    { id_rol: 2, nombre_rol: 'Farmacéutico' },
    { id_rol: 3, nombre_rol: 'Vendedor' },
  ],
  Usuario: [
    { id_usuario: 1, nombre: 'Super Admin', usuario: 'admin', hash_contraseña: 'hash_ejemplo_admin123', estado: true, fecha_creacion: '2025-12-22T00:00:00Z' },
  ],
  UsuarioRol: [
    { id_usuario: 1, id_rol: 1, fecha_asignacion: '2025-12-22' },
  ],
  Medicamento: [
    { id_medicamento: 1, nombre_comercial: 'Paracetamol 500mg', principio_activo: 'Paracetamol', stock_minimo: 50, ubicacion: '1A', precio_venta: 2.50, estado: true },
    { id_medicamento: 2, nombre_comercial: 'Amoxicilina 875mg', principio_activo: 'Amoxicilina', stock_minimo: 20, ubicacion: '2B', precio_venta: 15.00, estado: true },
    { id_medicamento: 3, nombre_comercial: 'Aspirina Forte', principio_activo: 'Ácido Acetilsalicílico', stock_minimo: 30, ubicacion: '3C', precio_venta: 3.75, estado: true },
  ],
  Lote: [
    { id_lote: 1, id_medicamento: 1, numero_lote: 'PT500-L001', fecha_vencimiento: '2026-06-30', stock_actual: 150, precio_compra: 1.20 },
    { id_lote: 2, id_medicamento: 1, numero_lote: 'PT500-L002', fecha_vencimiento: '2024-10-15', stock_actual: 30, precio_compra: 1.15 },
    { id_lote: 3, id_medicamento: 2, numero_lote: 'AMX875-Q045', fecha_vencimiento: '2025-12-01', stock_actual: 80, precio_compra: 8.50 },
    { id_lote: 4, id_medicamento: 3, numero_lote: 'ASP-X900', fecha_vencimiento: '2027-01-20', stock_actual: 100, precio_compra: 1.90 },
  ],
  Venta: [
    { id_venta: 1, id_usuario: 1, fecha_venta: '2025-12-22T10:00:00Z', total_venta: 48.75, tipo_comprobante: 'Ticket', dni_cliente: '12345678', numero_receta: null },
  ],
  DetalleVenta: [
    { id_detalle_venta: 1, id_venta: 1, id_lote: 1, cantidad: 10, precio_unitario: 2.50 },
    { id_detalle_venta: 2, id_venta: 1, id_lote: 3, cantidad: 1, precio_unitario: 15.00 },
    { id_detalle_venta: 3, id_venta: 1, id_lote: 4, cantidad: 2, precio_unitario: 3.75 },
  ],
  Alerta: [
    // Ejemplo de alerta de stock mínimo y caducidad
    { id_alerta: 1, id_lote: 2, id_medicamento: 1, tipo_alerta: 'Caducidad', nivel_riesgo: 'Amarillo', fecha_creacion: '2025-12-22T00:00:00Z', estado: false },
    { id_alerta: 2, id_lote: 2, id_medicamento: 1, tipo_alerta: 'Stock Mínimo', nivel_riesgo: 'Rojo', fecha_creacion: '2025-12-22T00:00:00Z', estado: false },
  ],
  Auditoria: [
    // Ejemplo vacío, se llenaría con logs de acciones
  ],
};

module.exports = dbSchema;
