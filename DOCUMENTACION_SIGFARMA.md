# 📚 DOCUMENTACIÓN COMPLETA - SIGFARMA
## Sistema Integral de Gestión Farmacéutica

---

## 📋 ÍNDICE

1. [Descripción General](#1-descripción-general)
2. [Tecnologías y Librerías](#2-tecnologías-y-librerías)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Arquitectura de la Aplicación](#4-arquitectura-de-la-aplicación)
5. [Componentes del Sistema](#5-componentes-del-sistema)
6. [Páginas y Módulos](#6-páginas-y-módulos)
7. [Sistema de Autenticación](#7-sistema-de-autenticación)
8. [Gestión de Datos](#8-gestión-de-datos)
9. [Servicios y API](#9-servicios-y-api)
10. [Estilos y Diseño](#10-estilos-y-diseño)
11. [Decisiones de Arquitectura](#11-decisiones-de-arquitectura)
12. [Guía de Uso](#12-guía-de-uso)

---

## 1. DESCRIPCIÓN GENERAL

### ¿Qué es SIGFARMA?

**SIGFARMA** (Sistema Integral de Gestión Farmacéutica) es una aplicación web desarrollada en React para la gestión completa de una farmacia. El sistema permite:

- 🏠 **Dashboard principal** con KPIs y métricas en tiempo real
- 💊 **Gestión de inventario** de medicamentos con control de lotes
- 🛒 **Punto de venta (POS)** con validación de productos
- ⚠️ **Sistema de alertas** para vencimientos y stock bajo
- 📊 **Reportes y exportación** a PDF y Excel
- 👥 **Control de usuarios** con roles (Admin, Farmacéutico, Vendedor)

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| **Sistema de Semáforo** | 🔴 Rojo (vencido/crítico), 🟡 Amarillo (por vencer), 🟢 Verde (vigente) |
| **Validación de Ventas** | Bloqueo automático de productos vencidos o con menos de 30 días |
| **Control de Recetas** | Medicamentos que requieren receta médica |
| **Multi-rol** | Diferentes permisos según el rol del usuario |
| **Exportación** | Generación de reportes en PDF y Excel |

---

## 2. TECNOLOGÍAS Y LIBRERÍAS

### 2.1 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.10.0",
  "react-icons": "^5.5.0",
  "recharts": "^3.5.1",
  "axios": "^1.13.2",
  "xlsx": "^0.18.5",
  "jspdf-autotable": "^5.0.2"
}
```

### 2.2 Explicación de cada Librería

| Librería | Versión | Propósito | ¿Por qué se eligió? |
|----------|---------|-----------|---------------------|
| **react** | 19.2.0 | Framework principal | Última versión estable, componentes funcionales con hooks |
| **react-dom** | 19.2.0 | Renderizado DOM | Necesario para React en navegadores |
| **react-router-dom** | 7.10.0 | Navegación/Rutas | Manejo de rutas SPA, rutas protegidas, redirecciones |
| **react-icons** | 5.5.0 | Iconografía | +4000 iconos (Feather, FontAwesome, etc.), tree-shaking |
| **recharts** | 3.5.1 | Gráficos | Gráficos de torta, barras, líneas para KPIs y Dashboard |
| **axios** | 1.13.2 | HTTP Client | Peticiones API, interceptores, manejo de errores |
| **xlsx** | 0.18.5 | Exportar Excel | Generación de archivos .xlsx para reportes |
| **jspdf-autotable** | 5.0.2 | Exportar PDF | Generación de PDFs con tablas profesionales |

### 2.3 Dependencias de Desarrollo

```json
{
  "tailwindcss": "^4.1.17",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.22"
}
```

> **Nota:** Tailwind está instalado pero el proyecto usa principalmente **estilos inline** para mayor control y evitar conflictos. Se dejó instalado para uso futuro si se requiere.

### 2.4 Dependencias de Testing

```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^13.5.0"
}
```

---

## 3. ESTRUCTURA DEL PROYECTO

```
sistema-farmacia/
│
├── 📁 public/                    # Archivos públicos estáticos
│   ├── index.html               # HTML principal (punto de entrada)
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots
│
├── 📁 src/                       # Código fuente principal
│   │
│   ├── 📁 assets/               # Recursos estáticos
│   │   ├── 📁 images/           # Imágenes del sistema
│   │   │   └── login-bg.jpg     # Fondo de login
│   │   └── README.md            # Documentación de assets
│   │
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── Sidebar.jsx          # ⭐ Navegación lateral (CENTRALIZADO)
│   │   ├── ProtectedRoute.jsx   # Protección de rutas
│   │   ├── CardKPI.jsx          # Tarjetas de métricas
│   │   ├── AlertasTable.jsx     # Tabla de alertas
│   │   ├── ChartMedicamentos.jsx# Gráfico de medicamentos
│   │   ├── ChartVentas.jsx      # Gráfico de ventas
│   │   ├── QuickAccessButton.jsx# Botones de acceso rápido
│   │   └── README.md            # Documentación de componentes
│   │
│   ├── 📁 context/              # Contextos de React
│   │   └── AuthContext.js       # ⭐ Estado global de autenticación
│   │
│   ├── 📁 data/                 # Datos mock/simulados
│   │   └── mockData.js          # ⭐ Datos de prueba del sistema
│   │
│   ├── 📁 pages/                # Páginas/Vistas principales
│   │   ├── Login.jsx            # Página de inicio de sesión
│   │   ├── Dashboard.jsx        # Panel principal con KPIs
│   │   ├── Inventario.jsx       # Redirección a medicamentos
│   │   │
│   │   ├── 📁 medicamentos/     # Módulo de inventario
│   │   │   ├── MedicamentosList.jsx   # Lista de medicamentos
│   │   │   ├── MedicamentoDetail.jsx  # Detalle de medicamento
│   │   │   └── MedicamentoForm.jsx    # Crear/Editar medicamento
│   │   │
│   │   ├── 📁 alertas/          # Módulo de alertas
│   │   │   ├── AlertasVencimiento.jsx # Alertas por vencimiento
│   │   │   └── AlertasStock.jsx       # Alertas por stock bajo
│   │   │
│   │   ├── 📁 ventas/           # Módulo de ventas
│   │   │   ├── VentaForm.jsx          # Punto de venta (POS)
│   │   │   ├── VentasHistorial.jsx    # Historial de ventas
│   │   │   └── ValidarLote.jsx        # Validación de lotes
│   │   │
│   │   ├── 📁 reportes/         # Módulo de reportes
│   │   │   ├── ExportReport.jsx       # Centro de reportes
│   │   │   └── KPIs.jsx               # Dashboard de KPIs
│   │   │
│   │   └── README.md            # Documentación de páginas
│   │
│   ├── 📁 services/             # Servicios y API
│   │   ├── api.js               # ⭐ Funciones de API/Mock
│   │   └── README.md            # Documentación de servicios
│   │
│   ├── 📁 styles/               # Estilos CSS
│   │   └── Login.css            # Estilos del login
│   │
│   ├── App.js                   # ⭐ Componente raíz con rutas
│   ├── App.css                  # Estilos globales
│   ├── index.js                 # Punto de entrada React
│   └── index.css                # Estilos base
│
├── 📄 package.json              # Dependencias y scripts
├── 📄 package-lock.json         # Lock de versiones
├── 📄 .gitignore                # Archivos ignorados por Git
└── 📄 README.md                 # Documentación principal
```

---

## 4. ARQUITECTURA DE LA APLICACIÓN

### 4.1 Flujo de la Aplicación

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.js                                 │
│                    (Punto de entrada)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          App.js                                  │
│              (Router + AuthProvider + Rutas)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌────────────┐   ┌──────────────┐
        │  Login   │   │ Protected  │   │   Rutas      │
        │  (/)     │   │   Route    │   │  Protegidas  │
        └──────────┘   └────────────┘   └──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AuthContext                                  │
│          (Estado global: user, login, logout)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Sidebar     │     │    Pages      │     │   Services    │
│ (Navegación)  │     │  (Contenido)  │     │    (API)      │
└───────────────┘     └───────────────┘     └───────────────┘
```

### 4.2 Patrón de Diseño

El proyecto sigue el patrón **Container/Presentational** con:

1. **Contextos (Context API)**: Estado global compartido
2. **Componentes Reutilizables**: UI independiente del estado
3. **Páginas**: Lógica de negocio + composición de componentes
4. **Servicios**: Abstracción de comunicación con backend

---

## 5. COMPONENTES DEL SISTEMA

### 5.1 Sidebar.jsx ⭐ (COMPONENTE CLAVE)

**Ubicación:** `src/components/Sidebar.jsx`

**Propósito:** Navegación lateral consistente en toda la aplicación.

**¿Por qué se centralizó?**
- Antes: Cada página tenía su propio sidebar → **inconsistencia visual**
- Después: Un solo componente → **consistencia garantizada**

**Características:**
```jsx
// Menú de navegación
const menuItems = [
  { icon: <FiHome />, label: 'Inicio', path: '/dashboard' },
  { icon: <FiPackage />, label: 'Inventario', path: '/medicamentos' },
  { icon: <FiShoppingCart />, label: 'Nueva Venta', path: '/ventas/nueva' },
  { icon: <FiList />, label: 'Historial', path: '/ventas/historial' },
  { icon: <FiAlertTriangle />, label: 'Vencimiento', path: '/alertas/vencimiento' },
  { icon: <FiAlertCircle />, label: 'Stock Bajo', path: '/alertas/stock' },
  { icon: <FiFileText />, label: 'Reportes', path: '/reportes/exportar' },
  { icon: <FiBarChart2 />, label: 'KPIs', path: '/reportes/kpis' },
];
```

**Incluye:**
- Logo SIGFARMA
- 8 opciones de menú con iconos
- Indicador de ruta activa
- Información del usuario conectado
- Rol del usuario (👑 Admin, 💊 Farmacéutico, 🛒 Vendedor)
- Reloj en tiempo real
- Botón de cerrar sesión

---

### 5.2 ProtectedRoute.jsx

**Propósito:** Proteger rutas que requieren autenticación.

```jsx
// Si no está autenticado → redirige a Login
if (!isAuthenticated()) {
  return <Navigate to="/" state={{ from: location }} replace />;
}

// Si está autenticado → muestra el contenido
return children;
```

---

### 5.3 Otros Componentes

| Componente | Propósito |
|------------|-----------|
| `CardKPI.jsx` | Tarjetas para mostrar métricas/KPIs |
| `AlertasTable.jsx` | Tabla reutilizable para alertas |
| `ChartMedicamentos.jsx` | Gráfico de distribución de medicamentos |
| `ChartVentas.jsx` | Gráfico de ventas por período |
| `QuickAccessButton.jsx` | Botones de acceso rápido |

---

## 6. PÁGINAS Y MÓDULOS

### 6.1 Login.jsx

**Ruta:** `/`

**Funcionalidades:**
- Formulario de inicio de sesión
- Validación de credenciales
- Redirección automática si ya está autenticado
- Muestra credenciales de demo

**Credenciales de prueba:**
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| farmaceutico | farma123 | Farmacéutico |
| vendedor | venta123 | Vendedor |
| yefferson | 123456 | Administrador |

---

### 6.2 Dashboard.jsx

**Ruta:** `/dashboard`

**Funcionalidades:**
- KPIs principales (productos vencidos, por vencer, stock crítico)
- Gráfico de semáforo de caducidad (Pie Chart)
- Tabla de productos próximos a vencer
- Header con información del usuario y hora

---

### 6.3 Módulo de Medicamentos

| Archivo | Ruta | Función |
|---------|------|---------|
| `MedicamentosList.jsx` | `/medicamentos` | Lista con filtros y búsqueda |
| `MedicamentoDetail.jsx` | `/medicamentos/:id` | Detalle con lotes |
| `MedicamentoForm.jsx` | `/medicamentos/new` `/medicamentos/edit/:id` | Crear/Editar |

**Sistema de Semáforo:**
```javascript
// Lógica de colores por días restantes
if (diasRestantes <= 30) return 'rojo';      // 🔴 Vencido/Crítico
if (diasRestantes <= 60) return 'amarillo';  // 🟡 Por vencer
return 'verde';                               // 🟢 Vigente
```

---

### 6.4 Módulo de Alertas

| Archivo | Ruta | Función |
|---------|------|---------|
| `AlertasVencimiento.jsx` | `/alertas/vencimiento` | Productos por vencer |
| `AlertasStock.jsx` | `/alertas/stock` | Productos con stock bajo |

---

### 6.5 Módulo de Ventas

| Archivo | Ruta | Función |
|---------|------|---------|
| `VentaForm.jsx` | `/ventas/nueva` | Punto de venta (POS) |
| `VentasHistorial.jsx` | `/ventas/historial` | Historial con filtros |
| `ValidarLote.jsx` | `/ventas/validar-lote` | Validación de lotes |

**Validación de Ventas:**
```javascript
// Productos vencidos o con menos de 30 días NO se pueden vender
if (diasRestantes <= 30) {
  return { permitido: false, mensaje: 'Producto vencido o próximo a vencer' };
}
```

---

### 6.6 Módulo de Reportes

| Archivo | Ruta | Función |
|---------|------|---------|
| `ExportReport.jsx` | `/reportes/exportar` | Centro de reportes (7 tipos) |
| `KPIs.jsx` | `/reportes/kpis` | Dashboard avanzado de KPIs |

**Tipos de Reportes:**
1. Inventario General
2. Alertas de Vencimiento
3. Ventas del Período
4. Stock Crítico
5. Por Principio Activo
6. Clientes Frecuentes
7. Productos Más Vendidos

---

## 7. SISTEMA DE AUTENTICACIÓN

### 7.1 AuthContext.js

**Ubicación:** `src/context/AuthContext.js`

**Estado Global:**
```javascript
const [user, setUser] = useState(null);      // Usuario actual
const [loading, setLoading] = useState(true); // Estado de carga
const [error, setError] = useState(null);     // Errores
```

**Funciones Expuestas:**
```javascript
{
  user,              // Datos del usuario
  login,             // Función de login
  logout,            // Función de logout
  loading,           // Estado de carga
  error,             // Errores
  isAuthenticated    // Verificar si está autenticado
}
```

### 7.2 Flujo de Autenticación

```
1. Usuario ingresa credenciales
          │
          ▼
2. login(username, password)
          │
          ▼
3. API verifica credenciales
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
  ✓ OK        ✗ Error
    │           │
    ▼           ▼
4. Guardar    Mostrar
   token      mensaje
   en LS      error
    │
    ▼
5. Redirigir a /dashboard
```

### 7.3 Persistencia de Sesión

```javascript
// Al hacer login exitoso
localStorage.setItem('sigfarma_token', token);
localStorage.setItem('sigfarma_user', JSON.stringify(user));

// Al cargar la app, verificar si hay sesión activa
const token = localStorage.getItem('sigfarma_token');
if (token) {
  // Verificar validez del token
  await verificarToken(token);
}
```

---

## 8. GESTIÓN DE DATOS

### 8.1 mockData.js

**Ubicación:** `src/data/mockData.js`

**¿Por qué datos mock?**
- Desarrollo sin backend
- Pruebas rápidas
- Demostración del sistema
- Fácil migración a API real

**Datos Incluidos:**
```javascript
// Medicamentos con lotes
export const medicamentos = [
  {
    id: 1,
    nombre: 'Paracetamol 500mg',
    principio_activo: 'Paracetamol',
    categoria: 'Analgésicos',
    precio_compra: 1.50,
    precio_venta: 2.50,
    requiere_receta: false,
    lotes: [
      {
        id: 'L-2025-001',
        cantidad: 100,
        fecha_vencimiento: '2025-06-15',
        proveedor: 'Distribuidora ABC'
      }
    ]
  }
];

// Historial de ventas
export const ventasHistorial = [...];

// Clientes registrados
export const clientes = [...];

// Funciones de utilidad
export const calcularDiasRestantes = (fecha) => {...};
export const getEstadoSemaforo = (dias) => {...};
export const getAlertasVencimiento = () => {...};
export const getAlertasStock = () => {...};
```

---

## 9. SERVICIOS Y API

### 9.1 api.js

**Ubicación:** `src/services/api.js`

**Configuración:**
```javascript
// Toggle para cambiar entre mock y API real
const USE_MOCK = true;

// Configuración de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

### 9.2 Funciones Disponibles

| Función | Descripción |
|---------|-------------|
| `login(username, password)` | Autenticación |
| `logout()` | Cerrar sesión |
| `verificarToken(token)` | Validar token |
| `getMedicamentos()` | Obtener todos los medicamentos |
| `getMedicamentoById(id)` | Obtener medicamento por ID |
| `buscarMedicamentos(query)` | Buscar medicamentos |
| `getAlertasVencimientoAPI()` | Alertas de vencimiento |
| `getAlertasStockAPI()` | Alertas de stock |
| `getVentasHistorial()` | Historial de ventas |
| `procesarVenta(data)` | Procesar una venta |
| `validarProductoParaVenta(lote)` | Validar si se puede vender |
| `getReporteInventario()` | Reporte de inventario |
| `getReporteAlertas()` | Reporte de alertas |

### 9.3 Migración a API Real

Para conectar con un backend real:

```javascript
// Cambiar de:
const USE_MOCK = true;

// A:
const USE_MOCK = false;

// Y configurar la URL del backend:
const API_URL = 'https://tu-api.com/api';
```

---

## 10. ESTILOS Y DISEÑO

### 10.1 Estrategia de Estilos

**Decisión:** Usar **estilos inline** en lugar de CSS externo o Tailwind.

**¿Por qué?**
1. **Control total**: Cada componente controla sus estilos
2. **No hay conflictos**: Sin problemas de especificidad CSS
3. **Co-localización**: Estilos junto al componente
4. **Dinámicos**: Fácil cambiar estilos según estado

**Ejemplo:**
```jsx
<button
  style={{
    padding: '10px 20px',
    backgroundColor: isActive ? '#1976d2' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = '#1976d2';
  }}
>
  Botón
</button>
```

### 10.2 Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Azul primario | `#1976d2` | Acciones principales, sidebar activo |
| Verde éxito | `#22c55e` | Vigente, ventas, confirmaciones |
| Amarillo alerta | `#eab308` | Por vencer, advertencias |
| Rojo error | `#ef4444` | Vencido, errores, logout |
| Gris fondo | `#f5f5f5` | Fondo de la aplicación |
| Gris sidebar | `#f0f0f0` | Fondo del sidebar |

### 10.3 Sistema de Semáforo Visual

```css
/* Rojo - Vencido/Crítico */
backgroundColor: '#fee2e2'
color: '#dc2626'

/* Amarillo - Por Vencer */
backgroundColor: '#fef3c7'
color: '#d97706'

/* Verde - Vigente */
backgroundColor: '#dcfce7'
color: '#16a34a'
```

---

## 11. DECISIONES DE ARQUITECTURA

### 11.1 ¿Por qué React?

- **Componentización**: UI dividida en piezas reutilizables
- **Virtual DOM**: Rendimiento optimizado
- **Hooks**: Estado y efectos sin clases
- **Ecosistema**: Gran cantidad de librerías
- **Comunidad**: Soporte y documentación extensa

### 11.2 ¿Por qué Sidebar Centralizado?

**Problema Original:**
- 11+ páginas con sidebar propio
- Estilos diferentes en cada página
- Inconsistencia visual
- Duplicación de código (~100 líneas por página)

**Solución:**
- Un componente `Sidebar.jsx` reutilizable
- Importado en todas las páginas
- Consistencia garantizada
- Mantenimiento simplificado

### 11.3 ¿Por qué Datos Mock?

**Ventajas:**
1. Desarrollo sin backend
2. Pruebas inmediatas
3. Demo funcional
4. Fácil transición a API real

**Estructura preparada para API:**
```javascript
// Cambiar USE_MOCK = false activa las llamadas reales
export const getMedicamentos = async () => {
  if (USE_MOCK) {
    return Promise.resolve(medicamentos); // Mock
  }
  return api.get('/medicamentos');         // API real
};
```

### 11.4 ¿Por qué Context API en lugar de Redux?

- **Simplicidad**: Solo autenticación global
- **Sin boilerplate**: No requiere actions/reducers
- **Suficiente**: Para el tamaño actual del proyecto
- **Nativo**: No requiere dependencias adicionales

### 11.5 Archivos que se Mantuvieron

| Archivo | Razón |
|---------|-------|
| `App.test.js` | Testing futuro |
| `setupTests.js` | Configuración de Jest |
| `reportWebVitals.js` | Métricas de rendimiento |
| `.gitkeep` en carpetas | Mantener estructura en Git |
| `README.md` en carpetas | Documentación modular |

---

## 12. GUÍA DE USO

### 12.1 Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>
cd sistema-farmacia

# Instalar dependencias
npm install

# Iniciar desarrollo
npm start

# Crear build de producción
npm run build
```

### 12.2 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm start` | Servidor en localhost:3000 |
| Build | `npm run build` | Crear versión de producción |
| Test | `npm test` | Ejecutar pruebas |
| Eject | `npm run eject` | Exponer configuración (irreversible) |

### 12.3 Flujo de Uso Típico

```
1. Login → /
   ↓
2. Dashboard → /dashboard (KPIs, alertas)
   ↓
3. Inventario → /medicamentos (ver stock)
   ↓
4. Nueva Venta → /ventas/nueva (POS)
   ↓
5. Ver Historial → /ventas/historial
   ↓
6. Generar Reportes → /reportes/exportar
```

### 12.4 Variables de Entorno

```env
# .env (crear en raíz del proyecto)
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 📝 NOTAS FINALES

### Mejoras Futuras Sugeridas

1. **Backend real** con Node.js/Express o Django
2. **Base de datos** PostgreSQL o MongoDB
3. **Testing** con Jest y React Testing Library
4. **PWA** para uso offline
5. **Notificaciones push** para alertas
6. **Código de barras** para búsqueda rápida
7. **Multi-sucursal** para cadenas de farmacias

### Mantenimiento

- Mantener `USE_MOCK = true` durante desarrollo
- Actualizar `mockData.js` para nuevos escenarios
- Usar el mismo formato de datos que la futura API
- Documentar cambios en este archivo

---

**Versión:** 1.0.0  
**Última actualización:** 9 de Diciembre de 2025  
**Desarrollado para:** SIGFARMA - Sistema Integral de Gestión Farmacéutica

