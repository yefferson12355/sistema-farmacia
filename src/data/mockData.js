/**
 * DATOS SIMULADOS - SIGFARMA
 * Estos datos simulan las respuestas del backend de Joel
 * Incluyen productos vencidos y por vencer para demostrar la validación
 * TIPOS: todos los objetos tienen estructuras claras y bien definidas
 */

// Fecha actual para cálculos
const hoy = new Date();
const agregarDias = (dias) => {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().split('T')[0];
};

/**
 * TIPOS DE DATOS:
 * - medicamentos: Array<Object> - Productos del sistema
 * - ventasHistorial: Array<Object> - Transacciones realizadas
 * - clientes: Array<Object> - Base de datos de clientes
 * - alertas: Array<Object> - Alertas del sistema
 */

// ============================================
// MEDICAMENTOS CON LOTES
// ============================================
export const medicamentos = [
  {
    id: 1,
    nombre_comercial: 'Paracetamol 500mg',
    principio_activo: 'Paracetamol',
    ubicacion: 'Estante A-1',
    precio_venta: 2.50,
    stock_total: 150,
    stock_minimo: 20,
    requiere_receta: false,
    lotes: [
      { id: 101, codigo: 'L-2025-001', cantidad: 50, fecha_vencimiento: agregarDias(5), estado: 'vencido' },
      { id: 102, codigo: 'L-2025-002', cantidad: 100, fecha_vencimiento: agregarDias(120), estado: 'vigente' },
    ]
  },
  {
    id: 2,
    nombre_comercial: 'Amoxicilina 500mg',
    principio_activo: 'Amoxicilina',
    ubicacion: 'Estante B-2',
    precio_venta: 8.00,
    stock_total: 45,
    stock_minimo: 30,
    requiere_receta: true,
    lotes: [
      { id: 201, codigo: 'L-2025-003', cantidad: 25, fecha_vencimiento: agregarDias(45), estado: 'por_vencer' },
      { id: 202, codigo: 'L-2025-004', cantidad: 20, fecha_vencimiento: agregarDias(90), estado: 'vigente' },
    ]
  },
  {
    id: 3,
    nombre_comercial: 'Ibuprofeno 400mg',
    principio_activo: 'Ibuprofeno',
    ubicacion: 'Estante A-3',
    precio_venta: 3.50,
    stock_total: 200,
    stock_minimo: 50,
    requiere_receta: false,
    lotes: [
      { id: 301, codigo: 'L-2025-005', cantidad: 200, fecha_vencimiento: agregarDias(180), estado: 'vigente' },
    ]
  },
  {
    id: 4,
    nombre_comercial: 'Omeprazol 20mg',
    principio_activo: 'Omeprazol',
    ubicacion: 'Estante C-1',
    precio_venta: 12.00,
    stock_total: 15,
    stock_minimo: 25,
    requiere_receta: true,
    lotes: [
      { id: 401, codigo: 'L-2025-006', cantidad: 15, fecha_vencimiento: agregarDias(-5), estado: 'vencido' },
    ]
  },
  {
    id: 5,
    nombre_comercial: 'Losartán 50mg',
    principio_activo: 'Losartán Potásico',
    ubicacion: 'Estante D-2',
    precio_venta: 15.00,
    stock_total: 80,
    stock_minimo: 20,
    requiere_receta: true,
    lotes: [
      { id: 501, codigo: 'L-2025-007', cantidad: 30, fecha_vencimiento: agregarDias(25), estado: 'por_vencer' },
      { id: 502, codigo: 'L-2025-008', cantidad: 50, fecha_vencimiento: agregarDias(200), estado: 'vigente' },
    ]
  },
  {
    id: 6,
    nombre_comercial: 'Metformina 850mg',
    principio_activo: 'Metformina HCL',
    ubicacion: 'Estante D-3',
    precio_venta: 6.50,
    stock_total: 120,
    stock_minimo: 40,
    requiere_receta: true,
    lotes: [
      { id: 601, codigo: 'L-2025-009', cantidad: 120, fecha_vencimiento: agregarDias(150), estado: 'vigente' },
    ]
  },
  {
    id: 7,
    nombre_comercial: 'Vitamina C 1000mg',
    principio_activo: 'Ácido Ascórbico',
    ubicacion: 'Estante E-1',
    precio_venta: 18.00,
    stock_total: 60,
    stock_minimo: 15,
    requiere_receta: false,
    lotes: [
      { id: 701, codigo: 'L-2025-010', cantidad: 20, fecha_vencimiento: agregarDias(10), estado: 'vencido' },
      { id: 702, codigo: 'L-2025-011', cantidad: 40, fecha_vencimiento: agregarDias(55), estado: 'por_vencer' },
    ]
  },
  {
    id: 8,
    nombre_comercial: 'Diclofenaco 75mg',
    principio_activo: 'Diclofenaco Sódico',
    ubicacion: 'Estante A-4',
    precio_venta: 4.00,
    stock_total: 90,
    stock_minimo: 30,
    requiere_receta: false,
    lotes: [
      { id: 801, codigo: 'L-2025-012', cantidad: 90, fecha_vencimiento: agregarDias(95), estado: 'vigente' },
    ]
  },
  {
    id: 9,
    nombre_comercial: 'Cetirizina 10mg',
    principio_activo: 'Cetirizina HCL',
    ubicacion: 'Estante B-1',
    precio_venta: 5.50,
    stock_total: 8,
    stock_minimo: 20,
    requiere_receta: false,
    lotes: [
      { id: 901, codigo: 'L-2025-013', cantidad: 8, fecha_vencimiento: agregarDias(40), estado: 'por_vencer' },
    ]
  },
  {
    id: 10,
    nombre_comercial: 'Azitromicina 500mg',
    principio_activo: 'Azitromicina',
    ubicacion: 'Estante B-3',
    precio_venta: 25.00,
    stock_total: 35,
    stock_minimo: 15,
    requiere_receta: true,
    lotes: [
      { id: 1001, codigo: 'L-2025-014', cantidad: 35, fecha_vencimiento: agregarDias(220), estado: 'vigente' },
    ]
  },
  {
    id: 11,
    nombre_comercial: 'Atorvastatina 40mg',
    principio_activo: 'Atorvastatina',
    ubicacion: 'Estante D-1',
    precio_venta: 22.00,
    stock_total: 42,
    stock_minimo: 20,
    requiere_receta: true,
    lotes: [
      { id: 1101, codigo: 'L-2025-015', cantidad: 42, fecha_vencimiento: agregarDias(240), estado: 'vigente' },
    ]
  },
  {
    id: 12,
    nombre_comercial: 'Lisinopril 10mg',
    principio_activo: 'Lisinopril',
    ubicacion: 'Estante D-4',
    precio_venta: 18.50,
    stock_total: 55,
    stock_minimo: 25,
    requiere_receta: true,
    lotes: [
      { id: 1201, codigo: 'L-2025-016', cantidad: 55, fecha_vencimiento: agregarDias(200), estado: 'vigente' },
    ]
  },
  {
    id: 13,
    nombre_comercial: 'Cloramphenicol 250mg',
    principio_activo: 'Cloramphenicol',
    ubicacion: 'Estante C-2',
    precio_venta: 16.00,
    stock_total: 28,
    stock_minimo: 15,
    requiere_receta: true,
    lotes: [
      { id: 1301, codigo: 'L-2025-017', cantidad: 28, fecha_vencimiento: agregarDias(160), estado: 'vigente' },
    ]
  },
  {
    id: 14,
    nombre_comercial: 'Dipirona 500mg',
    principio_activo: 'Dipirona',
    ubicacion: 'Estante A-2',
    precio_venta: 2.80,
    stock_total: 250,
    stock_minimo: 100,
    requiere_receta: false,
    lotes: [
      { id: 1401, codigo: 'L-2025-018', cantidad: 150, fecha_vencimiento: agregarDias(140), estado: 'vigente' },
      { id: 1402, codigo: 'L-2025-019', cantidad: 100, fecha_vencimiento: agregarDias(35), estado: 'por_vencer' },
    ]
  },
  {
    id: 15,
    nombre_comercial: 'Ranitidina 150mg',
    principio_activo: 'Ranitidina HCL',
    ubicacion: 'Estante C-3',
    precio_venta: 7.50,
    stock_total: 65,
    stock_minimo: 30,
    requiere_receta: true,
    lotes: [
      { id: 1501, codigo: 'L-2025-020', cantidad: 65, fecha_vencimiento: agregarDias(170), estado: 'vigente' },
    ]
  },
  {
    id: 16,
    nombre_comercial: 'Claritromicina 500mg',
    principio_activo: 'Claritromicina',
    ubicacion: 'Estante B-4',
    precio_venta: 28.00,
    stock_total: 22,
    stock_minimo: 10,
    requiere_receta: true,
    lotes: [
      { id: 1601, codigo: 'L-2025-021', cantidad: 22, fecha_vencimiento: agregarDias(210), estado: 'vigente' },
    ]
  },
  {
    id: 17,
    nombre_comercial: 'Furosemida 40mg',
    principio_activo: 'Furosemida',
    ubicacion: 'Estante E-2',
    precio_venta: 11.00,
    stock_total: 48,
    stock_minimo: 20,
    requiere_receta: true,
    lotes: [
      { id: 1701, codigo: 'L-2025-022', cantidad: 48, fecha_vencimiento: agregarDias(180), estado: 'vigente' },
    ]
  },
  {
    id: 18,
    nombre_comercial: 'Naproxeno 500mg',
    principio_activo: 'Naproxeno',
    ubicacion: 'Estante A-5',
    precio_venta: 6.00,
    stock_total: 95,
    stock_minimo: 40,
    requiere_receta: false,
    lotes: [
      { id: 1801, codigo: 'L-2025-023', cantidad: 95, fecha_vencimiento: agregarDias(190), estado: 'vigente' },
    ]
  },
  {
    id: 19,
    nombre_comercial: 'Ketoconazol Crema 2%',
    principio_activo: 'Ketoconazol',
    ubicacion: 'Estante F-1',
    precio_venta: 14.00,
    stock_total: 18,
    stock_minimo: 10,
    requiere_receta: false,
    lotes: [
      { id: 1901, codigo: 'L-2025-024', cantidad: 18, fecha_vencimiento: agregarDias(120), estado: 'vigente' },
    ]
  },
  {
    id: 20,
    nombre_comercial: 'Gentamicina Inyectable 80mg',
    principio_activo: 'Gentamicina',
    ubicacion: 'Estante G-1',
    precio_venta: 35.00,
    stock_total: 12,
    stock_minimo: 8,
    requiere_receta: true,
    lotes: [
      { id: 2001, codigo: 'L-2025-025', cantidad: 12, fecha_vencimiento: agregarDias(150), estado: 'vigente' },
    ]
  },
];

// ============================================
// ALERTAS CALCULADAS
// ============================================

// ============================================
// HISTORIAL DE VENTAS DETALLADO (Array<Object>)
// Cada venta tiene estructura completa con cliente, productos, totales
// ============================================
export const ventasHistorial = [
  { 
    id: 1, 
    fecha: '2025-12-09', 
    cliente_dni: '12345678', 
    cliente_nombre: 'María García',
    productos: [
      { nombre: 'Paracetamol 500mg', cantidad: 2, precio_unitario: 2.50 },
      { nombre: 'Vitamina C 1000mg', cantidad: 1, precio_unitario: 18.00 }
    ], 
    total: 23.00, 
    vendedor: 'Juan Pérez',
    metodoPago: 'Efectivo'
  },
  { 
    id: 2, 
    fecha: '2025-12-09', 
    cliente_dni: '87654321', 
    cliente_nombre: 'Carlos López',
    productos: [
      { nombre: 'Amoxicilina 500mg', cantidad: 1, precio_unitario: 8.00 }
    ], 
    total: 8.00, 
    vendedor: 'Ana Martínez',
    metodoPago: 'Tarjeta'
  },
  { 
    id: 3, 
    fecha: '2025-12-08', 
    cliente_dni: '11223344', 
    cliente_nombre: 'Rosa Sánchez',
    productos: [
      { nombre: 'Ibuprofeno 400mg', cantidad: 3, precio_unitario: 3.50 },
      { nombre: 'Omeprazol 20mg', cantidad: 2, precio_unitario: 12.00 },
      { nombre: 'Losartán 50mg', cantidad: 1, precio_unitario: 15.00 }
    ], 
    total: 54.50, 
    vendedor: 'Juan Pérez',
    metodoPago: 'Efectivo'
  },
  { 
    id: 4, 
    fecha: '2025-12-08', 
    cliente_dni: '44332211', 
    cliente_nombre: 'Pedro Ramírez',
    productos: [
      { nombre: 'Metformina 850mg', cantidad: 1, precio_unitario: 6.50 },
      { nombre: 'Diclofenaco 75mg', cantidad: 1, precio_unitario: 4.00 }
    ], 
    total: 10.50, 
    vendedor: 'Ana Martínez',
    metodoPago: 'Efectivo'
  },
  { 
    id: 5, 
    fecha: '2025-12-07', 
    cliente_dni: '99887766', 
    cliente_nombre: 'Lucía Fernández',
    productos: [
      { nombre: 'Cetirizina 10mg', cantidad: 2, precio_unitario: 5.50 },
      { nombre: 'Azitromicina 500mg', cantidad: 1, precio_unitario: 25.00 }
    ], 
    total: 36.00, 
    vendedor: 'Juan Pérez',
    metodoPago: 'Tarjeta'
  },
  { 
    id: 6, 
    fecha: '2025-12-07', 
    cliente_dni: '55443322', 
    cliente_nombre: 'Juan Torres',
    productos: [
      { nombre: 'Paracetamol 500mg', cantidad: 5, precio_unitario: 2.50 }
    ], 
    total: 12.50, 
    vendedor: 'Ana Martínez',
    metodoPago: 'Efectivo'
  },
  { 
    id: 7, 
    fecha: '2025-12-06', 
    cliente_dni: '66554433', 
    cliente_nombre: 'Ana Gómez',
    productos: [
      { nombre: 'Vitamina C 1000mg', cantidad: 3, precio_unitario: 18.00 },
      { nombre: 'Paracetamol 500mg', cantidad: 2, precio_unitario: 2.50 }
    ], 
    total: 59.00, 
    vendedor: 'Juan Pérez',
    metodoPago: 'Tarjeta'
  },
  { 
    id: 8, 
    fecha: '2025-12-06', 
    cliente_dni: '12345678', 
    cliente_nombre: 'María García',
    productos: [
      { nombre: 'Ibuprofeno 400mg', cantidad: 2, precio_unitario: 3.50 }
    ], 
    total: 7.00, 
    vendedor: 'Ana Martínez',
    metodoPago: 'Tarjeta'
  },
  { 
    id: 9, 
    fecha: '2025-12-05', 
    cliente_dni: '33221100', 
    cliente_nombre: 'Miguel Rodríguez',
    productos: [
      { nombre: 'Losartán 50mg', cantidad: 1, precio_unitario: 15.00 },
      { nombre: 'Metformina 850mg', cantidad: 2, precio_unitario: 6.50 }
    ], 
    total: 28.00, 
    vendedor: 'Juan Pérez',
    metodoPago: 'Efectivo'
  },
  { 
    id: 10, 
    fecha: '2025-12-05', 
    cliente_dni: '77665544', 
    cliente_nombre: 'Elena Morales',
    productos: [
      { nombre: 'Amoxicilina 500mg', cantidad: 2, precio_unitario: 8.00 },
      { nombre: 'Azitromicina 500mg', cantidad: 1, precio_unitario: 25.00 }
    ], 
    total: 41.00, 
    vendedor: 'Ana Martínez',
    metodoPago: 'Tarjeta'
  },
];

// ============================================
// BASE DE CLIENTES (Array<Object>)
// Información centralizada de todos los clientes
// ============================================
export const clientes = [
  { dni: '12345678', nombre: 'María García', email: 'maria@email.com', telefono: '999111222', ciudad: 'Lima' },
  { dni: '87654321', nombre: 'Carlos López', email: 'carlos@email.com', telefono: '998222333', ciudad: 'Lima' },
  { dni: '11223344', nombre: 'Rosa Sánchez', email: 'rosa@email.com', telefono: '997333444', ciudad: 'Arequipa' },
  { dni: '44332211', nombre: 'Pedro Ramírez', email: 'pedro@email.com', telefono: '996444555', ciudad: 'Lima' },
  { dni: '99887766', nombre: 'Lucía Fernández', email: 'lucia@email.com', telefono: '995555666', ciudad: 'Cusco' },
  { dni: '55443322', nombre: 'Juan Torres', email: 'juan@email.com', telefono: '994666777', ciudad: 'Lima' },
  { dni: '66554433', nombre: 'Ana Gómez', email: 'ana@email.com', telefono: '993777888', ciudad: 'Trujillo' },
  { dni: '33221100', nombre: 'Miguel Rodríguez', email: 'miguel@email.com', telefono: '992888999', ciudad: 'Lima' },
  { dni: '77665544', nombre: 'Elena Morales', email: 'elena@email.com', telefono: '991999000', ciudad: 'Piura' },
  { dni: '88776655', nombre: 'Fernando Ortiz', email: 'fernando@email.com', telefono: '990000111', ciudad: 'Lima' },
  { dni: '99008877', nombre: 'Susana Vera', email: 'susana@email.com', telefono: '989111222', ciudad: 'Tacna' },
  { dni: '11009988', nombre: 'Ricardo Flores', email: 'ricardo@email.com', telefono: '988222333', ciudad: 'Ayacucho' },
  { dni: '22110099', nombre: 'Gabriela Quispe', email: 'gabriela@email.com', telefono: '987333444', ciudad: 'Puno' },
  { dni: '33221199', nombre: 'Andrés Vargas', email: 'andres@email.com', telefono: '986444555', ciudad: 'Lima' },
  { dni: '44332299', nombre: 'Patricia Ruiz', email: 'patricia@email.com', telefono: '985555666', ciudad: 'Junín' },
];

// ============================================
// FUNCIONES AUXILIARES (Tipos correctos)
// ============================================

/**
 * Calcula días restantes para vencimiento
 * @param {string} fechaVencimiento - Formato: YYYY-MM-DD
 * @returns {number} Días restantes (negativo si vencido)
 */
export const calcularDiasRestantes = (fechaVencimiento) => {
  const fecha = new Date(fechaVencimiento);
  return Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene estado del semáforo basado en días restantes
 * @param {number} diasRestantes - Número de días restantes
 * @returns {Object} - { estado: string, color: string, bg: string, texto: string }
 */
export const getEstadoSemaforo = (diasRestantes) => {
  if (diasRestantes <= 30) return { estado: 'vencido', color: '#ef4444', bg: '#fee2e2', texto: 'VENCIDO' };
  if (diasRestantes <= 60) return { estado: 'por_vencer', color: '#eab308', bg: '#fef3c7', texto: 'POR VENCER' };
  return { estado: 'vigente', color: '#22c55e', bg: '#dcfce7', texto: 'VIGENTE' };
};

/**
 * Valida si un producto puede venderse
 * @param {Object} lote - Objeto lote con fecha_vencimiento
 * @returns {Object} - { permitido: boolean, mensaje: string, diasRestantes: number }
 */
export const validarVenta = (lote) => {
  const diasRestantes = calcularDiasRestantes(lote.fecha_vencimiento);
  if (diasRestantes <= 30) {
    return {
      permitido: false,
      mensaje: '¡ALERTA! Producto próximo a vencer o vencido. Venta Bloqueada.',
      diasRestantes
    };
  }
  return { permitido: true, diasRestantes };
};

/**
 * Obtiene alertas de vencimiento
 * @returns {Array<Object>} - Array de alertas ordenado por días restantes
 */
export const getAlertasVencimiento = () => {
  const alertas = [];
  medicamentos.forEach(med => {
    med.lotes.forEach(lote => {
      const fechaVenc = new Date(lote.fecha_vencimiento);
      const diasRestantes = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 60) {
        alertas.push({
          id: lote.id,
          medicamento: med.nombre_comercial,
          lote: lote.codigo,
          cantidad: lote.cantidad,
          fecha_vencimiento: lote.fecha_vencimiento,
          dias_restantes: diasRestantes,
          estado: diasRestantes <= 30 ? 'vencido' : 'por_vencer',
          ubicacion: med.ubicacion,
        });
      }
    });
  });
  return alertas.sort((a, b) => a.dias_restantes - b.dias_restantes);
};

/**
 * Obtiene alertas de stock bajo
 * @returns {Array<Object>} - Array de medicamentos con stock bajo
 */
export const getAlertasStock = () => {
  return medicamentos
    .filter(med => med.stock_total <= med.stock_minimo)
    .map(med => ({
      id: med.id,
      medicamento: med.nombre_comercial,
      stock_actual: med.stock_total,
      stock_minimo: med.stock_minimo,
      deficit: med.stock_minimo - med.stock_total,
      ubicacion: med.ubicacion,
    }));
};
