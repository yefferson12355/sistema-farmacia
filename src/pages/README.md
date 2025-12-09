# 📁 Carpeta: pages/

## Descripción
Contiene las **páginas/vistas principales** del sistema. Cada archivo representa una pantalla completa.

## Estructura de Carpetas

```
pages/
├── Login.jsx              # Inicio de sesión
├── Dashboard.jsx          # Panel principal con KPIs
├── Inventario.jsx         # Redirección a medicamentos
│
├── medicamentos/          # Módulo de inventario
│   ├── MedicamentosList.jsx    # Lista de medicamentos
│   ├── MedicamentoDetail.jsx   # Detalle de un medicamento
│   └── MedicamentoForm.jsx     # Crear/Editar medicamento
│
├── alertas/               # Módulo de alertas
│   ├── AlertasVencimiento.jsx  # Productos por vencer
│   └── AlertasStock.jsx        # Stock bajo mínimo
│
├── ventas/                # Módulo de ventas
│   ├── VentaForm.jsx           # Punto de venta (POS)
│   ├── VentasHistorial.jsx     # Historial de ventas
│   └── ValidarLote.jsx         # Validación de lotes
│
└── reportes/              # Módulo de reportes
    ├── ExportReport.jsx        # Centro de reportes
    └── KPIs.jsx                # Dashboard de KPIs
```

## Rutas del Sistema

| Ruta | Página | Protegida |
|------|--------|-----------|
| `/` | Login.jsx | ❌ No |
| `/dashboard` | Dashboard.jsx | ✅ Sí |
| `/medicamentos` | MedicamentosList.jsx | ✅ Sí |
| `/medicamentos/:id` | MedicamentoDetail.jsx | ✅ Sí |
| `/medicamentos/new` | MedicamentoForm.jsx | ✅ Sí |
| `/medicamentos/edit/:id` | MedicamentoForm.jsx | ✅ Sí |
| `/alertas/vencimiento` | AlertasVencimiento.jsx | ✅ Sí |
| `/alertas/stock` | AlertasStock.jsx | ✅ Sí |
| `/ventas/nueva` | VentaForm.jsx | ✅ Sí |
| `/ventas/historial` | VentasHistorial.jsx | ✅ Sí |
| `/reportes/exportar` | ExportReport.jsx | ✅ Sí |
| `/reportes/kpis` | KPIs.jsx | ✅ Sí |

## Patrón de Página

Todas las páginas protegidas siguen este patrón:

```jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

function MiPagina() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Contenido de la página */}
      </main>
    </div>
  );
}

export default MiPagina;
```

## Módulos Explicados

### 🏠 Dashboard
- KPIs principales
- Gráfico de semáforo de caducidad
- Tabla de productos próximos a vencer

### 💊 Medicamentos
- CRUD completo de medicamentos
- Control de lotes con fecha de vencimiento
- Sistema de semáforo (🔴🟡🟢)

### ⚠️ Alertas
- Productos vencidos o por vencer
- Productos con stock bajo
- Filtros y exportación

### 🛒 Ventas
- Punto de venta (POS)
- Validación de productos vencidos
- Control de recetas médicas
- Historial con búsqueda y filtros

### 📊 Reportes
- 7 tipos de reportes
- Exportación a PDF y Excel
- Dashboard de KPIs avanzado
