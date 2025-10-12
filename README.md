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

### Desarrollo y Calidad de Código

- **ESLint 9.36.0** - Herramienta de linting para identificar y reportar patrones en JavaScript
- **@vitejs/plugin-react 5.0.4** - Plugin oficial de Vite para React con Fast Refresh
- **eslint-plugin-react-hooks** - Reglas de ESLint para React Hooks
- **eslint-plugin-react-refresh** - Plugin de ESLint para React Fast Refresh

### TypeScript Support

- **@types/react** - Definiciones de tipos para React
- **@types/react-dom** - Definiciones de tipos para React DOM

## ✨ Características

- 🏠 **Página de Inicio** - Banner principal y productos destacados
- 🛍️ **Catálogo de Productos** - Visualización de todos los productos disponibles
- 🔍 **Detalle de Producto** - Vista detallada de cada producto
- 📂 **Categorías** - Navegación por categorías de productos
- 🎨 **Diseño Responsive** - Interfaz adaptable a diferentes dispositivos
- ⚡ **Carga Rápida** - Skeletons de carga para mejor UX
- 🔄 **Scroll to Top** - Navegación automática al tope en cambios de ruta
- 🎯 **Página 404** - Manejo de rutas no encontradas

## 📁 Estructura del Proyecto

```text
project-react/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── BannerHome/     # Banner de la página principal
│   │   ├── CategoryCard/   # Tarjeta de categoría
│   │   ├── Footer/         # Pie de página
│   │   ├── Header/         # Encabezado
│   │   ├── Nav/            # Navegación
│   │   ├── ProductCard/    # Tarjeta de producto
│   │   └── ScrollToTop/    # Componente de scroll
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home/           # Página de inicio
│   │   ├── Products/       # Lista de productos
│   │   ├── ProductDetail/  # Detalle del producto
│   │   ├── Categories/     # Lista de categorías
│   │   └── NotFound/       # Página 404
│   ├── assets/             # Recursos estáticos
│   ├── helpers/            # Funciones auxiliares
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos públicos
│   ├── data/              # Archivos JSON con datos
│   └── images/            # Imágenes de productos
└── dist/                  # Build de producción
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

- `/` - Página de inicio
- `/products` - Lista de todos los productos
- `/products/:id` - Detalle de un producto específico
- `/categories` - Lista de categorías
- `/*` - Página 404 para rutas no encontradas

## 🎨 Características de UX

- **Skeleton Loaders**: Implementados en ProductCard, CategoryCard y ProductDetail para mejorar la percepción de velocidad durante la carga
- **Scroll to Top**: Navegación automática al inicio de la página al cambiar de ruta
- **Responsive Design**: Diseño adaptable a dispositivos móviles, tablets y desktop

## 📦 Datos

El proyecto utiliza archivos JSON locales para simular una API:

- `public/data/products.json` - Información de productos
- `public/data/categories.json` - Información de categorías

## 🚀 Despliegue

El proyecto está desplegado en [Render.com](https://render.com) y está disponible en: [https://project-react-talento-tech.onrender.com](https://project-react-talento-tech.onrender.com)

El proyecto incluye un archivo `render.yaml` para facilitar el despliegue en Render.com.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias o mejoras.

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ por Eric para Talento Tech - Agencia de Habilidades para el futuro
