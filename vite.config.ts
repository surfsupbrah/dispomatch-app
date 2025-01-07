import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/coordinates': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});