import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: false, // We'll handle assets manually
  build: {
    outDir: 'public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        english: './index-en.html'
      }
    },
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 3000,
    host: true
  },
  // Optimize for static site deployment
  optimizeDeps: {
    include: []
  },
  // Ensure proper handling of static assets
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.pdf']
});