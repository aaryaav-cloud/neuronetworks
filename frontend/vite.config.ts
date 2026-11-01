import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, /api calls go to the backend on port 4000.
// In production, vercel.json does the same job.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000' },
  },
});
