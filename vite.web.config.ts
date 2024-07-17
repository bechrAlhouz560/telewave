import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-web', // Output directory for the web build
    
    assetsDir: 'assets',
    rollupOptions: {
      input: './index.html', // Entry point for the web build
    },
  },
  publicDir : "public", 
});
