import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@mood/domain': fileURLToPath(new URL('../../domain/src/index.ts', import.meta.url)),
      '@mood/web-adapters': fileURLToPath(new URL('../../adapters/src/index.ts', import.meta.url))
    }
  },
  server: {
    port: 8090,
    proxy: {
      // Utilisez le chemin que vous allez utiliser dans vos requêtes Axios, par exemple '/api'
      '/api': {
        target: 'http://mood-api:8000', // Remplacez par l'URL de votre API
        rewrite: (path) => path.replace(/^\/api/, ''),
        onProxyReq: (proxyReq, req) => {
          console.log(`Proxying request: ${req.method} ${req.originalUrl}`)
        },
        onError: (err) => {
          console.error('Proxy error:', err)
        }
      }
    }
  }
})
