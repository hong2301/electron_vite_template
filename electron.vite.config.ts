import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

// 环境配置
dotenv.config()
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({
  path: envFile
})

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    assetsInclude: ['**/*.wasm', '**/*.task'],
    build: {
      assetsDir: 'assets'
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      {
        name: 'inject-csp',
        transformIndexHtml(html) {
          const cspContent = `
            default-src 'self';
            connect-src 'self' ${process.env.VITE_SERVER_BASE_URL}:${process.env.VITE_SERVER_PROD};
            script-src 'self' 'wasm-unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: blob:;
            font-src 'self';
            form-action 'none';
          `.replace(/\n/g, '')

          return html.replace(
            '<head>',
            `<head><meta http-equiv="Content-Security-Policy" content="${cspContent}">`
          )
        }
      }
    ],
    server: {
      host: process.env.VITE_APP_HOST,
      port: Number(process.env.VITE_APP_PORT),
      proxy: {
        '/api': {
          target: `${process.env.VITE_SERVER_BASE_URL}:${process.env.VITE_SERVER_PROD}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
