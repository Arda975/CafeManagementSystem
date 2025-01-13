import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Tüm ağlardan gelen istekleri kabul et
    port: 5173,      // Varsayılan port
  },
})
