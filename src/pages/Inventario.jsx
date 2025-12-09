/**
 * Inventario.jsx
 * Redirección a MedicamentosList - Mantener compatibilidad
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Inventario() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente a la página de medicamentos
    navigate('/medicamentos', { replace: true });
  }, [navigate]);

  return null;
}

export default Inventario;