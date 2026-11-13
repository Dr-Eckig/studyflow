import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'FRONTEND_')

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number(env.FRONTEND_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.FRONTEND_BACKEND_HOST || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
