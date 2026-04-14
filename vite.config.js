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
            src: '/img/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml"
    },
          {
            src: '/img/icon-512.png',  
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

       screenshots: [
            {
              src: '/img/sena.png',  
              sizes: '512x512',
              type: 'image/png',       
              form_factor: 'narrow',
            },
            {
              src: '/img/chat.png',
              sizes: '848x444',
              type: 'image/png',
              form_factor: 'wide',
            },
          ],
      },
    }),
  ],
})