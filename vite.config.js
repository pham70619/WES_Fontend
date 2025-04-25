import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // fix CORS error
  // server: {
  //   proxy: {
  //     '/api': {
  //       // target: 'https://39affaab-826e-47fd-ab0d-f0280628d.mock.pstmn.io',
  //       target: 'http://10.35.10.83:5000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  server: {
    host: '0.0.0.0', // Cho phép truy cập qua IP máy
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://10.35.10.83:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
