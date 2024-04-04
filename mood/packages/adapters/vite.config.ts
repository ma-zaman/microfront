import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@mood/domain': fileURLToPath(new URL('../domain/src/index.ts', import.meta.url)),
      '@mood/web-adapters': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    }
  },
  
})
