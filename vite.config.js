import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'img/icon-192.png',
        'img/icon-512.png',
        'img/notas.jpg',
        'img/chat.png',
      ],

      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,jsx,css,html,png,svg,jpg}'],
      },

      manifest: {
        name: 'Gestor Financiero',
        short_name: 'GestorFin',
        description: 'Registra, visualiza y controla tus gastos mensuales.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f1f5f9',
        theme_color: '#0f172a',

        icons: [
          {
            src: '/img/icon-192.png',  // ← existe en public/img/
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/img/icon-512.png',  // ← existe en public/img/
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        screenshots: [
          {
            src: '/img/notas.jpg',    
            sizes: '844x474',
            type: 'image/jpeg',       
            form_factor: 'narrow',
          },
          {
            src: '/img/chat.png',      // ← existe en public/img/
            sizes: '848x444',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
    }),
  ],
})