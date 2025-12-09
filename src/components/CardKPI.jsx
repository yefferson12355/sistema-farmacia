import React from 'react';

/**
 * CardKPI - Tarjeta reutilizable para mostrar KPIs
 * @param {string} title - Título del KPI
 * @param {number|string} value - Valor principal
 * @param {string} label - Etiqueta descriptiva
 * @param {React.ReactNode} icon - Icono a mostrar
 * @param {string} color - Clase de color (blue, red, green, yellow, purple)
 * @param {string} trend - Tendencia opcional (+5%, -2%, etc)
 */
function CardKPI({ title, value, label, icon, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500',
    cyan: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-l-4 border-cyan-500',
  };

  const textColors = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    cyan: 'text-cyan-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className={`${textColors[color]} text-3xl font-bold`}>{value}</h3>
            {trend && <span className="text-xs text-gray-500">{trend}</span>}
          </div>
          <p className="text-gray-500 text-xs mt-1">{label}</p>
        </div>
        <div className={`${textColors[color]} text-3xl opacity-20 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default CardKPI;
