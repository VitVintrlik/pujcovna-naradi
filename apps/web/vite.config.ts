import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:3100',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/reference-data': {
        target: 'http://localhost:3002',
        rewrite: (path) => path.replace(/^\/api\/reference-data/, ''),
      },
    },
  },
});
