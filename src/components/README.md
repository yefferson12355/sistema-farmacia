# 📁 Carpeta: components/

## Descripción
Contiene **componentes reutilizables** que se usan en múltiples páginas del sistema.

## Archivos

| Archivo | Descripción | Usado en |
|---------|-------------|----------|
| `Sidebar.jsx` | ⭐ Navegación lateral centralizada | Todas las páginas protegidas |
| `ProtectedRoute.jsx` | Protección de rutas que requieren login | App.js (envuelve rutas) |
| `CardKPI.jsx` | Tarjetas para mostrar métricas | Dashboard, KPIs |
| `AlertasTable.jsx` | Tabla de alertas reutilizable | Alertas |
| `ChartMedicamentos.jsx` | Gráfico de medicamentos | Dashboard |
| `ChartVentas.jsx` | Gráfico de ventas | Dashboard, KPIs |
| `QuickAccessButton.jsx` | Botones de acceso rápido | Dashboard |

## Componente Principal: Sidebar.jsx

### ¿Por qué se centralizó?
Antes cada página tenía su propia implementación del sidebar, causando:
- ❌ Inconsistencia visual entre páginas
- ❌ Código duplicado (~100 líneas por página)
- ❌ Difícil mantenimiento

Ahora con un solo componente:
- ✅ Consistencia garantizada
- ✅ Un solo lugar para cambios
- ✅ Fácil mantenimiento

### Estructura del Sidebar
```
┌─────────────────────┐
│  [+] SIGFARMA       │  ← Logo
├─────────────────────┤
│  🏠 Inicio          │
│  📦 Inventario      │
│  🛒 Nueva Venta     │
│  📋 Historial       │  ← Menú de navegación
│  ⚠️ Vencimiento     │
│  ⚠️ Stock Bajo      │
│  📄 Reportes        │
│  📊 KPIs            │
├─────────────────────┤
│  👤 Usuario         │
│  👑 Admin           │  ← Info usuario
│  🕐 10:30:45        │
│  [Cerrar Sesión]    │
└─────────────────────┘
```

## Cómo usar un componente

```jsx
// Importar
import Sidebar from '../components/Sidebar';

// Usar en JSX
function MiPagina() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main>
        {/* Contenido */}
      </main>
    </div>
  );
}
```

## Convenciones

1. **Nombres**: PascalCase (ej: `MiComponente.jsx`)
2. **Extensión**: `.jsx` para componentes React
3. **Exports**: `export default` al final del archivo
4. **Props**: Documentar con comentarios si es necesario
