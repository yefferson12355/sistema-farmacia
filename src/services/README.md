# 📁 Carpeta: services/

## Descripción
Capa de **comunicación con el backend/API**. Abstrae las llamadas HTTP del resto de la aplicación.

## Archivo Principal: api.js

### Configuración

```javascript
// Toggle para desarrollo
const USE_MOCK = true;  // true = datos mock, false = API real

// Configuración de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

### Funciones Disponibles

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `login(username, password)` | string, string | Autenticación de usuario |
| `logout()` | - | Cerrar sesión |
| `verificarToken(token)` | string | Validar token activo |
| `getMedicamentos()` | - | Obtener todos los medicamentos |
| `getMedicamentoById(id)` | number | Obtener medicamento por ID |
| `buscarMedicamentos(query)` | string | Buscar por nombre/código |
| `crearMedicamento(data)` | object | Crear nuevo medicamento |
| `actualizarMedicamento(id, data)` | number, object | Actualizar medicamento |
| `getAlertasVencimientoAPI()` | - | Alertas de vencimiento |
| `getAlertasStockAPI()` | - | Alertas de stock bajo |
| `getVentasHistorial()` | - | Historial de ventas |
| `procesarVenta(data)` | object | Procesar una venta |
| `validarProductoParaVenta(lote)` | object | Verificar si se puede vender |
| `getReporteInventario()` | - | Reporte de inventario |
| `getReporteAlertas()` | - | Reporte de alertas |
| `getReportePrincipioActivo()` | - | Reporte por principio activo |
| `getReporteClientes()` | - | Reporte de clientes |
| `getReporteProductosMasVendidos()` | - | Productos más vendidos |

### Uso en Componentes

```jsx
import { getMedicamentos, procesarVenta } from '../services/api';

// En un componente
useEffect(() => {
  const cargarDatos = async () => {
    const data = await getMedicamentos();
    setMedicamentos(data);
  };
  cargarDatos();
}, []);
```

### Migración a API Real

Para conectar con un backend real:

1. Cambiar `USE_MOCK = false` en api.js
2. Configurar `REACT_APP_API_URL` en archivo `.env`
3. Asegurar que el backend devuelva el mismo formato de datos

```javascript
// api.js
const USE_MOCK = false;

// .env
REACT_APP_API_URL=https://api.sigfarma.com/v1
```

## Usuarios de Prueba (Mock)

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| farmaceutico | farma123 | Farmacéutico |
| vendedor | venta123 | Vendedor |
| yefferson | 123456 | Administrador |
