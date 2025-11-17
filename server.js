import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para logging de peticiones (útil para diagnóstico)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(join(__dirname, 'dist'), {
  // Asegurar que los archivos estáticos se sirvan correctamente
  maxAge: '1y',
  etag: true
}));

// Para todas las rutas, servir index.html (SPA fallback)
// Esto debe ir después de express.static para que los archivos estáticos tengan prioridad
// Usamos app.all para manejar todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
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

