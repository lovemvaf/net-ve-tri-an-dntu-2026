import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/net-ve-tri-an-dntu-2026/',
  optimizeDeps: {
    entries: ['index.html']
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    watch: {
      ignored: ['**/.research/**', '**/anhchoslide5va6/**', '**/dist/**', '**/test-results/**']
    }
  },
  preview: {
    port: 4173,
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 900
  }
});
