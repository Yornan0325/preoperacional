import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from "vite-plugin-svgr";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgr({
      svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
  ],
  
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    global: 'globalThis', // Define global como globalThis para compatibilidad
  },
  optimizeDeps: {
    include: ['crypto-browserify', 'stream-browserify', 'buffer', 'util'],
  },
});
