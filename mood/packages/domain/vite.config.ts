import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@mood/domain': fileURLToPath(new URL('./src/index.ts', import.meta.url))
    }
  },
})
