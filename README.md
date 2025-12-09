# 💊 SIGFARMA - Sistema Integral de Gestión Farmacéutica

![React](https://img.shields.io/badge/React-19.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)

## 📋 Descripción

**SIGFARMA** es un sistema web completo para la gestión de farmacias, desarrollado con React. Incluye control de inventario, punto de venta, alertas de vencimiento, reportes y más.

## ✨ Características

- 🏠 **Dashboard** con KPIs en tiempo real
- 💊 **Inventario** de medicamentos con control de lotes
- 🛒 **Punto de Venta (POS)** con validación de productos
- ⚠️ **Alertas** de vencimiento y stock bajo
- 📊 **Reportes** exportables a PDF y Excel
- 👥 **Multi-usuario** con roles (Admin, Farmacéutico, Vendedor)
- 🚦 **Sistema de Semáforo** para estado de productos

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd sistema-farmacia

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo en localhost:3000 |
| `npm run build` | Crea build de producción optimizado |
| `npm test` | Ejecuta pruebas |

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| farmaceutico | farma123 | Farmacéutico |
| vendedor | venta123 | Vendedor |
| yefferson | 123456 | Administrador |

## 🛠️ Tecnologías

- **React 19** - Framework frontend
- **React Router 7** - Navegación SPA
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **jsPDF + XLSX** - Exportación de reportes
- **React Icons** - Iconografía

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos
├── components/      # Componentes reutilizables
├── context/         # Contextos de React (Auth)
├── data/            # Datos mock
├── pages/           # Páginas/Vistas
├── services/        # API y servicios
└── styles/          # Estilos CSS
```

## 📚 Documentación

Ver [DOCUMENTACION_SIGFARMA.md](./DOCUMENTACION_SIGFARMA.md) para documentación completa.

## 🎯 Sistema de Semáforo

| Color | Días | Estado |
|-------|------|--------|
| 🔴 Rojo | ≤30 | Vencido/Crítico |
| 🟡 Amarillo | 31-60 | Por vencer |
| 🟢 Verde | >60 | Vigente |


## 📄 Licencia

MIT License - Ver archivo LICENSE
