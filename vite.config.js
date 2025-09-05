import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for production deployment
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  
  // Development server configuration
  server: { 
    port: 5173, 
    open: true,
    host: true
  },
  
  // CSS configuration for Tailwind
  css: {
    postcss: './postcss.config.js'
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico', '**/*.webp'],
  
  // Public directory
  publicDir: 'public',
  
  // Define configuration
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  // Optimizations
  optimizeDeps: {
    include: []
  }
})
