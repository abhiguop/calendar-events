import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude unused dependencies
  },
});

