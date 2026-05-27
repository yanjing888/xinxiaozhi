import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const difyTarget = env.VITE_DIFY_BASE_URL?.replace(/\/v1\/?$/, '') || 'http://188.18.18.149:5001'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/dify': {
          target: difyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dify/, '/v1'),
        },
      },
    },
  }
})
