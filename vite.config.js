import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeJsonPlugin } from './vite-plugin-write-json.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), writeJsonPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
