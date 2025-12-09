# 📁 Carpeta: assets/

## Descripción
Repositorio de **recursos estáticos** (imágenes, iconos, fuentes).

## Estructura

```
assets/
└── images/
    └── login-bg.jpg    # Fondo de la página de login
```

## Archivos Actuales

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `images/login-bg.jpg` | ~200KB | Fondo de pantalla de login |

## Cómo usar las imágenes

```jsx
// Importar la imagen
import loginBg from '../assets/images/login-bg.jpg';

// Usar en estilos
<div style={{ 
  backgroundImage: `url(${loginBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}>
```

## Convenciones

1. **Imágenes**: Carpeta `images/`
2. **Iconos**: Carpeta `icons/` (usamos react-icons en su lugar)
3. **Fuentes**: Carpeta `fonts/` (usamos fuentes del sistema)
4. **Formatos recomendados**:
   - Fotos: `.jpg` o `.webp`
   - Logos/iconos: `.svg` o `.png`
   - Fondos: `.jpg` (mejor compresión)

## Nota sobre Iconos

En lugar de iconos estáticos, usamos la librería **react-icons**:

```jsx
import { FiHome, FiPackage, FiShoppingCart } from 'react-icons/fi';

// Uso
<FiHome size={24} color="#1976d2" />
```

Ventajas:
- +4000 iconos disponibles
- Tree-shaking (solo importa lo que usa)
- Fácil personalización (size, color)
- Sin archivos adicionales
