// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // For custom domain root (https://yakkunlabs.com/). 
  // If you ever deploy under a subpath, change to '/repo-name/'.
  base: '/website',

  server: {
    host: true,
    port: 5173,
    open: true
  },

  preview: {
    host: true,
    port: 4180
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          const n = name || ''
          if (/\.(css)$/i.test(n)) return 'assets/css/[name]-[hash][extname]'
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(n)) return 'assets/img/[name]-[hash][extname]'
          if (/\.(woff2?|ttf|otf|eot)$/i.test(n)) return 'assets/fonts/[name]-[hash][extname]'
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
