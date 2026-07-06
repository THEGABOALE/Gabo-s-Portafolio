import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Respeta el puerto que asigne el entorno (PORT); por defecto 5173 en local
    port: Number(process.env.PORT) || 5173,
  },
})
