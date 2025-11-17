import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Plugin de Vite para permitir escribir en archivos JSON
 * Solo funciona en modo desarrollo
 */
export function writeJsonPlugin() {
  return {
    name: 'write-json',
    configureServer(server) {
      server.middlewares.use('/api/users', async (req, res, next) => {
        // Solo permitir en desarrollo
        if (process.env.NODE_ENV === 'production') {
          res.statusCode = 403
          res.end('Not available in production')
          return
        }

        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        // Obtener la ruta del proyecto desde la configuración del servidor
        const root = server.config.root || process.cwd()
        const usersFilePath = path.join(root, 'public', 'data', 'users.json')

        try {
          if (req.method === 'GET') {
            // Leer usuarios
            const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(users))
          } else if (req.method === 'PUT') {
            // Actualizar usuarios
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const users = JSON.parse(body)
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, message: 'Usuarios actualizados correctamente' }))
              } catch (error) {
                res.statusCode = 400
                res.end(JSON.stringify({ success: false, error: error.message }))
              }
            })
          } else {
            res.statusCode = 405
            res.end('Method not allowed')
          }
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ success: false, error: error.message }))
        }
      })
    }
  }
}

