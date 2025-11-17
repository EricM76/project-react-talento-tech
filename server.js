import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para logging de peticiones (útil para diagnóstico)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Función para servir archivos estáticos manualmente
const serveStatic = (req, res, next) => {
  const filePath = join(__dirname, 'dist', req.path);
  
  // Si la petición es para la raíz o no tiene extensión, es una ruta de la SPA
  if (req.path === '/' || !req.path.match(/\.[^/]+$/)) {
    return next();
  }
  
  // Verificar si el archivo existe
  if (existsSync(filePath)) {
    try {
      const stats = statSync(filePath);
      if (stats.isFile()) {
        // Servir el archivo estático
        const content = readFileSync(filePath);
        const ext = req.path.split('.').pop();
        const contentType = {
          'html': 'text/html',
          'js': 'application/javascript',
          'css': 'text/css',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        }[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        return res.send(content);
      }
    } catch (error) {
      console.error('Error serving static file:', error);
    }
  }
  
  // Si no es un archivo estático, continuar al siguiente middleware
  next();
};

app.use(serveStatic);

// Para todas las rutas de la SPA, servir index.html (SPA fallback)
// Esto maneja las rutas del cliente como /admin, /products, etc.
app.all('*', (req, res) => {
  try {
    const indexPath = join(__dirname, 'dist', 'index.html');
    if (!existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      return res.status(500).send('index.html not found. Please run npm run build first.');
    }
    const indexContent = readFileSync(indexPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(indexContent);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error loading application');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${join(__dirname, 'dist')}`);
  const indexPath = join(__dirname, 'dist', 'index.html');
  console.log(`index.html exists: ${existsSync(indexPath)}`);
});

