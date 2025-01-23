import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  base: '/',  // Asegúrate de que este valor sea correcto
  server: {
    host: '0.0.0.0',  // Acepta conexiones desde cualquier IP en la red local
    port: 5173,        // Puerto en el que corre el servidor (puedes cambiarlo si es necesario)
  },
  plugins: [react(), TanStackRouterVite()],
})
