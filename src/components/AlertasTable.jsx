import React from 'react';

/**
 * AlertasTable - Tabla de alertas de caducidad
 */
function AlertasTable({ data, onViewAll }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-800">Alertas de Caducidad</h3>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver todo →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700">Código</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700">Producto</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700">Vencimiento</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-600">{item.codigo}</td>
                  <td className="py-3 px-3 text-gray-800 font-medium">{item.producto}</td>
                  <td className="py-3 px-3 text-gray-600">{item.vencimiento}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.estado === 'Vencido'
                          ? 'bg-red-100 text-red-700'
                          : item.estado === 'Crítico'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  No hay alertas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertasTable;
