// Utilidad simulada para formatear fechas
exports.formatearFecha = (fecha) => {
  return fecha.toISOString().split('T')[0];
};
