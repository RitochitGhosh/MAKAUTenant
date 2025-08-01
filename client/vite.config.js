import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://makautenant.onrender.com/',
        secure: false,
      },
    },
  },
  
  plugins: [
    react(),
    tailwindcss(),
  ],
})

// https://makautenant.onrender.com/