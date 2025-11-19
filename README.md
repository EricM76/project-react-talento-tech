# Mercado Liebre - E-commerce React App

Una aplicación web de e-commerce moderna construida con React y Vite, inspirada en Mercado Libre. Este proyecto ofrece una experiencia de usuario fluida para navegar productos, categorías y ver detalles de productos.

## 🔗 Enlaces

- **Demo en vivo**: [https://project-react-talento-tech.onrender.com](https://project-react-talento-tech.onrender.com)
- **Repositorio**: [https://github.com/tu-usuario/project-react](https://github.com/tu-usuario/project-react)

## 🚀 Tecnologías Utilizadas

### Core

- **React 19.1.1** - Biblioteca de JavaScript para construir interfaces de usuario
- **React DOM 19.1.1** - Paquete que proporciona métodos específicos del DOM
- **Vite 7.1.7** - Herramienta de construcción rápida y servidor de desarrollo

### Routing

- **React Router DOM 7.9.4** - Enrutamiento declarativo para React

### UI y Notificaciones

- **SweetAlert2 11.26.3** - Librería para alertas y notificaciones elegantes

### APIs Externas

- **MockAPI** - API REST simulada para gestión de productos
- **ImgBB API** - Servicio para subida y almacenamiento de imágenes

### Desarrollo y Calidad de Código

- **ESLint 9.36.0** - Herramienta de linting para identificar y reportar patrones en JavaScript
- **@vitejs/plugin-react 5.0.4** - Plugin oficial de Vite para React con Fast Refresh
- **eslint-plugin-react-hooks** - Reglas de ESLint para React Hooks
- **eslint-plugin-react-refresh** - Plugin de ESLint para React Fast Refresh

### TypeScript Support

- **@types/react** - Definiciones de tipos para React
- **@types/react-dom** - Definiciones de tipos para React DOM

## ✨ Características

### 🛍️ Funcionalidades de Usuario

- 🏠 **Página de Inicio** - Banner principal con productos destacados organizados por secciones (Últimos agregados, Ofertas)
- 🛒 **Catálogo de Productos** - Visualización completa de todos los productos disponibles con filtrado por categorías y secciones
- 🔍 **Detalle de Producto** - Vista detallada con información completa, precios con descuentos y productos relacionados
- 📂 **Categorías** - Navegación intuitiva por categorías de productos
- 🛒 **Carrito de Compras** - Sistema completo de carrito con las siguientes funcionalidades:
  - Agregar productos al carrito
  - Modificar cantidades (aumentar/disminuir)
  - Eliminar productos individuales
  - Vaciar carrito completo
  - Cálculo automático de totales con descuentos
  - Persistencia en localStorage
  - Indicador de cantidad en el header
  - Sidebar deslizable con overlay
- 🎠 **Carrusel de Productos Relacionados** - Carousel interactivo con auto-play, navegación manual y diseño responsive
- 💰 **Sistema de Descuentos** - Cálculo automático de precios con descuentos porcentuales
- 🔄 **Filtrado y Búsqueda** - Filtrado por categorías, secciones y marcas

### 🔐 Sistema de Autenticación

- 🔑 **Login** - Inicio de sesión con nombre de usuario y contraseña
- 👤 **Nombre de Usuario** - Sistema de autenticación basado en username único
- 📝 **Registro** - Creación de nuevas cuentas de usuario con validación
  - Generación automática de username (formato: `nombre.apellido` en minúsculas, sin acentos, ñ→n)
  - Validación inteligente que no muestra errores cuando el username se genera automáticamente
  - Placeholder dinámico que muestra el username generado cuando el campo está vacío
- 🔒 **Recuperación de Contraseña** - Sistema para recuperar acceso a la cuenta
- 💾 **Recordarme** - Opción para mantener sesión activa (localStorage) o solo para la sesión actual (sessionStorage)
- 👥 **Roles de Usuario** - Sistema de roles (usuario regular y administrador)
- 🛡️ **Protección de Rutas** - Rutas protegidas que requieren autenticación y permisos específicos
- 🚫 **Validación de Cuentas** - Control de usuarios activos/inactivos

### 👨‍💼 Panel de Administración

- 📊 **Dashboard** - Panel principal con:
  - Resumen de métricas (usuarios activos, productos en catálogo, ventas mensuales)
  - Gráficos de rendimiento semanal
  - Visualización de categorías destacadas
  - Estado de inventario (en stock, próximos a agotarse, sin stock)
- 📦 **Gestión de Productos (CRUD Completo)**:
  - Listar todos los productos
  - Crear nuevos productos con formulario validado
  - Editar productos existentes
  - Eliminar productos
  - Subida de imágenes a ImgBB
  - Validación de campos en tiempo real
- 👥 **Gestión de Usuarios (CRUD Completo)**:
  - Listar todos los usuarios
  - Crear nuevos usuarios con asignación de roles
  - Generación automática de username (nombre.apellido normalizado)
  - Validación de username único
  - Activar/Desactivar usuarios
  - Resetear contraseñas
  - Eliminar usuarios
  - Gestión de roles (user/admin)
  - Formulario responsive con layout de dos columnas desde tablet (768px)

### 🎨 Experiencia de Usuario

- ⚡ **Skeleton Loaders** - Indicadores de carga en ProductCard, CategoryCard y ProductDetail
- 🔄 **Scroll to Top** - Navegación automática al inicio de la página al cambiar de ruta
- 📱 **Diseño Responsive** - Interfaz completamente adaptable a dispositivos móviles, tablets y desktop
- 🎯 **Página 404** - Manejo elegante de rutas no encontradas
- 🔔 **Notificaciones** - Alertas y confirmaciones con SweetAlert2
- 🎭 **Layouts Separados** - Layout principal para usuarios y layout administrativo con sidebar

## 📁 Estructura del Proyecto

```text
project-react/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── adminComponents/   # Componentes del panel de administración
│   │   │   ├── Dashboard/     # Panel de control principal
│   │   │   ├── Products/      # Gestión de productos (listar, crear, editar)
│   │   │   ├── Users/         # Gestión de usuarios
│   │   │   ├── ProductFormContainer/  # Contenedor del formulario de productos
│   │   │   ├── ProductFormUI/        # UI del formulario de productos
│   │   │   └── Sidebar/              # Barra lateral del admin
│   │   ├── authComponents/    # Componentes de autenticación
│   │   │   ├── LoginFormContainer/   # Contenedor del formulario de login
│   │   │   └── LoginFormUI/          # UI del formulario de login
│   │   ├── BannerHome/        # Banner de la página principal
│   │   ├── CarouselItems/     # Carrusel de productos relacionados
│   │   ├── Cart/              # Componente del carrito de compras
│   │   ├── CategoryCard/      # Tarjeta de categoría
│   │   ├── Footer/            # Pie de página
│   │   ├── Header/            # Encabezado con navegación
│   │   ├── Item/              # Tarjeta de producto (Item)
│   │   ├── ItemDetail/        # Detalle del producto
│   │   ├── ItemDetailContainer/  # Contenedor del detalle
│   │   ├── ItemList/          # Lista de productos
│   │   ├── ItemListContainer/ # Contenedor de lista de productos
│   │   ├── Nav/               # Navegación principal
│   │   └── ProtectedRoute/    # Componente para proteger rutas
│   ├── context/               # Context API para estado global
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   ├── AuthProvider.jsx   # Proveedor de autenticación
│   │   ├── CartContext.jsx    # Contexto del carrito
│   │   ├── CartProvider.jsx   # Proveedor del carrito
│   │   └── useCartContext.js  # Hook personalizado para el carrito
│   ├── layouts/               # Layouts de la aplicación
│   │   ├── AdminLayout.jsx    # Layout del panel de administración
│   │   └── MainLayout.jsx     # Layout principal de la aplicación
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Home/              # Página de inicio
│   │   ├── Products/          # Lista de productos
│   │   ├── ProductDetail/     # Detalle del producto
│   │   ├── Categories/        # Lista de categorías
│   │   ├── Dashboard/         # Dashboard del administrador
│   │   └── NotFound/           # Página 404
│   ├── services/              # Servicios para comunicación con APIs
│   │   ├── auth.js            # Servicios de autenticación
│   │   ├── products.js        # Servicios de productos (CRUD)
│   │   ├── users.js           # Servicios de usuarios (CRUD)
│   │   ├── categories.js      # Servicios de categorías
│   │   └── uploadImage.js     # Servicio de subida de imágenes a ImgBB
│   ├── utils/                 # Utilidades y helpers
│   │   ├── toThousand.js      # Formateo de números
│   │   └── validateProduct.js # Validación de productos
│   ├── assets/                # Recursos estáticos (imágenes, logos)
│   ├── App.jsx                # Componente principal con rutas
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── public/                    # Archivos públicos
│   ├── data/                  # Archivos JSON con datos
│   │   ├── products.json      # Datos de productos (local)
│   │   ├── categories.json    # Datos de categorías
│   │   ├── brands.json        # Datos de marcas
│   │   └── users.json         # Datos de usuarios
│   └── images/                # Imágenes de productos
└── dist/                      # Build de producción
```

## 🛠️ Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/project-react.git
    cd project-react
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo en modo de hot-reload.

### Build

```bash
npm run build
```

Construye la aplicación para producción en la carpeta `dist/`.

### Preview

```bash
npm run preview
```

Previsualiza la build de producción localmente.

### Start

```bash
npm start
```

Inicia el servidor de preview en el puerto 3000.

### Lint

```bash
npm run lint
```

Ejecuta ESLint para verificar la calidad del código.

## 🌐 Rutas de la Aplicación

### Rutas Públicas

- `/` - Página de inicio con banner y productos destacados
- `/products` - Lista de todos los productos
- `/products/:id` - Detalle de un producto específico con productos relacionados
- `/categories` - Lista de categorías disponibles

### Rutas de Administración (Protegidas)

- `/admin` - Página de login para administradores
- `/admin/dashboard` - Panel de control principal con métricas y estadísticas
- `/admin/productos` - Gestión de productos (listar, editar, eliminar)
- `/admin/productos/nuevo` - Formulario para crear nuevo producto
- `/admin/usuarios` - Gestión de usuarios (solo para administradores)

#### 🔑 Credenciales de Acceso al Dashboard

Para acceder al panel de administración, utiliza las siguientes credenciales:

**Nombre de Usuario:** `Admin`  
**Contraseña:** `1234`

También puedes usar estas credenciales alternativas:

| Nombre de Usuario | Contraseña | Rol |
|------------------|------------|-----|
| `BRomero` | `1234` | admin |
| `TTech` | `1234` | admin |

**Nota**: 
- El sistema de autenticación ahora utiliza **nombre de usuario** en lugar de email
- Los usernames se generan automáticamente con el formato: `nombre.apellido` en minúsculas, sin acentos, y convirtiendo ñ a n (ej: "Juan Pérez" → "juan.perez", "María Muñoz" → "maria.munoz")
- Estas credenciales son para desarrollo y demostración. En producción, deberían ser más seguras y gestionadas por un backend.

### Rutas de Error

- `/*` - Página 404 para rutas no encontradas

## 🎨 Características de UX

- **Skeleton Loaders**: Implementados en ProductCard, CategoryCard y ProductDetail para mejorar la percepción de velocidad durante la carga
- **Scroll to Top**: Navegación automática al inicio de la página al cambiar de ruta
- **Responsive Design**: Diseño adaptable a dispositivos móviles, tablets y desktop
- **Persistencia de Estado**: El carrito de compras se guarda automáticamente en localStorage
- **Notificaciones Interactivas**: Alertas elegantes con SweetAlert2 para feedback al usuario
- **Validación en Tiempo Real**: Los formularios validan campos mientras el usuario escribe
- **Generación Automática de Username**: El sistema genera automáticamente el nombre de usuario basado en nombre y apellido (formato normalizado: minúsculas, sin acentos, ñ→n)
- **Layout Responsive de Formularios**: Formularios de registro con layout de dos columnas desde tablet (768px) para mejor aprovechamiento del espacio
- **Carrusel Interactivo**: Productos relacionados con auto-play, navegación manual y pausa al hover
- **Sidebar de Carrito**: Carrito deslizable con overlay que previene scroll del body
- **Menú Hamburguesa**: Navegación móvil con menú deslizable

## 📦 Gestión de Datos

### APIs Externas

- **MockAPI** (`https://69057de8ee3d0d14c132c373.mockapi.io`) - API REST para gestión de productos (CRUD completo)
  - Endpoint: `/products`
  - Operaciones: GET, POST, PUT, DELETE

- **ImgBB API** - Servicio para subida y almacenamiento de imágenes
  - Conversión de imágenes a base64
  - Almacenamiento en CDN
  - URLs públicas para uso en productos

### Datos Locales (JSON)

El proyecto utiliza archivos JSON locales para datos estáticos y simulación de autenticación:

- `public/data/products.json` - Información de productos (backup local)
- `public/data/categories.json` - Información de categorías
- `public/data/brands.json` - Información de marcas
- `public/data/users.json` - Base de datos de usuarios para autenticación

## 🚀 Despliegue

El proyecto está desplegado en [Render.com](https://render.com) y está disponible en: [https://project-react-talento-tech.onrender.com](https://project-react-talento-tech.onrender.com)

El proyecto incluye un archivo `render.yaml` para facilitar el despliegue en Render.com.

## 🔧 Funcionalidades Técnicas

### Estado Global con Context API

- **CartContext**: Gestión global del carrito de compras con persistencia en localStorage
- **AuthContext**: Gestión de autenticación con soporte para localStorage y sessionStorage
- Hooks personalizados para facilitar el uso de los contextos

### Validaciones

- Validación de formularios en tiempo real
- Validación de productos (nombre, precio, descuento, descripción, categoría, imagen)
- Validación de usuarios (username, email, contraseña, campos requeridos)
- Validación de username único
- Normalización automática de texto (minúsculas, sin acentos, ñ→n)
- Validación de imágenes (tipo, tamaño)

### Manejo de Errores

- Manejo centralizado de errores en servicios
- Notificaciones de error con SweetAlert2
- Validación de respuestas de API
- Manejo de estados de carga

### Optimizaciones

- Lazy loading de componentes cuando sea necesario
- Persistencia de estado en localStorage/sessionStorage
- Cálculos optimizados de totales y descuentos
- Renderizado condicional para mejorar performance

## 🔐 Seguridad

- Protección de rutas con componente `ProtectedRoute`
- Validación de roles de usuario (user/admin)
- Control de usuarios activos/inactivos
- Validación de credenciales en el cliente (en producción debería ser en el backend)
- Limpieza de datos sensibles (contraseñas no se exponen)

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- **Mobile**: < 768px (1 columna, menú hamburguesa, carrito sidebar, formularios en columna)
- **Tablet**: 768px - 1023px (2 columnas, navegación adaptada, formularios en dos columnas, botones en fila)
- **Desktop**: 1024px - 1199px (4 columnas, formularios en dos columnas)
- **Large Desktop**: ≥ 1200px (5 columnas, máximo aprovechamiento, formularios en dos columnas)

## 🚀 Próximas Mejoras

- Integración con pasarela de pagos
- Sistema de reviews y calificaciones
- Búsqueda avanzada con filtros múltiples
- Wishlist (lista de deseos)
- Historial de compras
- Notificaciones push
- Modo oscuro

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias o mejoras.

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ por Eric para Talento Tech - Agencia de Habilidades para el futuro
