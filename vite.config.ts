import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
// https://vite.dev/config/
export default defineConfig({
  base: '/',  // Asegúrate de que este valor sea correcto
  plugins: [react(),TanStackRouterVite()],
})
