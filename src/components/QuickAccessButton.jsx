import React from 'react';

/**
 * QuickAccessButton - Botón de acceso rápido
 */
function QuickAccessButton({ icon, label, onClick, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
    teal: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} text-white font-semibold py-3 px-4 rounded-lg w-full flex items-center justify-between gap-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1`}
    >
      <span className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </span>
      <span className="text-lg">→</span>
    </button>
  );
}

export default QuickAccessButton;
