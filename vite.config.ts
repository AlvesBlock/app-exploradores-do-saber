import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,wav}'], // Cache de assets e áudios
        runtimeCaching: [
          {
            // Estratégia para imagens da Disney API (Galeria Encantada)
            urlPattern: /^https:\/\/static\.wikia\.nocookie\.net\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'disney-api-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Exploradores do Saber',
        short_name: 'Exploradores',
        description: 'App infantil educativo com trilhas e recompensas',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone', // Remove a barra do navegador para sensação de app nativo
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
