// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Port untuk Frontend Anda (tempat React berjalan)
    port: 5173, 
    // host: true, // Tidak wajib, tapi tidak masalah
    
    // --- Bagian PENTING untuk menghubungkan ke Backend (BE) ---
    proxy: {
      // Ketika Frontend mencoba mengakses URL yang dimulai dengan '/api' (misalnya, /api/users)
      '/api': {
        // Vite akan mengalihkan permintaan tersebut ke URL Backend ini:
        target: 'http://127.0.0.1:8000', 
        // Mengizinkan perubahan header Origin. PENTING untuk melewati CORS.
        changeOrigin: true, 
        // Jika Anda ingin menghilangkan '/api' dari permintaan yang dikirim ke BE:
        // rewrite: (path) => path.replace(/^\/api/, ''), 
        // (Tapi biasanya lebih mudah jika BE Anda memang sudah menggunakan rute /api)
      },
      // Anda bisa menambahkan rute lain di sini jika dibutuhkan
    },
    // -----------------------------------------------------------
  },
})