import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/website/',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  // Development server configuration
  server: { 
    port: 5173, 
    open: true 
  },
  
  // CSS configuration for Tailwind
  css: {
    postcss: './postcss.config.js'
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
  
  // Public directory
  publicDir: 'public'
})
