// vite.config.js
import { defineConfig } from 'vite'

// If you ever deploy under a subpath (e.g., https://username.github.io/repo/),
// change base to '/repo/'. For your apex domain yakkunlabs.com, keep it '/'.
export default defineConfig({
  base: '/',                 // ✅ correct for https://yakkunlabs.com/
  server: {
    port: 5173,              // dev: http://localhost:5173
    open: true               // auto-open browser on `npm run dev`
  },
  build: {
    outDir: 'dist',          // where `npm run build` outputs the site
    sourcemap: false,        // set true only if you need to debug prod
    assetsDir: 'assets',     // keep built assets under dist/assets
    cssMinify: true,         // minify CSS (Tailwind included)
    rollupOptions: {
      output: {
        // Helpful chunk names; leave default if you prefer hashed-only
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name]-[hash][extname]'
          if (/\.(css)$/.test(name)) return 'assets/css/[name]-[hash][extname]'
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return 'assets/img/[name]-[hash][extname]'
          if (/\.(woff2?|ttf|otf|eot)$/.test(name)) return 'assets/fonts/[name]-[hash][extname]'
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  preview: {
    port: 4180               // `npm run preview` -> http://localhost:4180
  }
})
