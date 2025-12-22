# Carpeta `core` (Simulación Backend Cliente-Servidor)

Esta carpeta simula la arquitectura de un backend real para el sistema SIGFARMA, bajo el modelo cliente-servidor. Aquí se estructura como si fuera un backend Node.js/Express conectado a una base de datos PostgreSQL.

## Estructura simulada:
- `/core/controllers` — Lógica de controladores para manejar las rutas y la lógica de negocio.
- `/core/models` — Definición de modelos de datos (por ejemplo, esquemas de medicamentos, usuarios, ventas, etc.).
- `/core/routes` — Definición de rutas/endpoints de la API.
- `/core/services` — Servicios para lógica de negocio reutilizable y acceso a datos.
- `/core/middlewares` — Middlewares para autenticación, validación, logging, etc.
- `/core/config` — Configuración general y simulación de conexión a base de datos PostgreSQL (`db.js`).
- `/core/utils` — Utilidades y helpers.
- `/core/app.js` — Punto de entrada simulado del backend (Express app).

### Simulación de PostgreSQL
En `/core/config/db.js` se simula la conexión y consultas a una base de datos PostgreSQL usando un pool ficticio. Así se representa la arquitectura realista de un sistema cliente-servidor con persistencia de datos.

> **Nota:** Esta estructura es solo una simulación y no contiene lógica real de backend, pero sirve como referencia para la arquitectura y documentación del sistema.
