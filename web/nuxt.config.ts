// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // Use the new app/ directory structure (Nuxt 4 compatible)
  srcDir: 'app/',
  future: { compatibilityVersion: 4 },

  // 静态生成（Cloudflare Pages / 任意 CDN 都能托管）
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/webp-to-png', '/webp-to-jpg', '/privacy', '/about', '/contact'],
    },
  },

  // CSS 入口
  css: ['~/assets/css/main.css'],

  // Tailwind v4 via Vite
  vite: {
    plugins: [tailwindcss()],
  },

  // 全局 app config（站点信息）
  runtimeConfig: {
    public: {
      siteUrl: 'https://toolkit.run',
      siteName: 'ToolKit',
      adsenseId: '',
    },
  },

  modules: ['@nuxtjs/sitemap', '@nuxt/eslint'],

  site: {
    url: 'https://toolkit.run',
    name: 'ToolKit.run',
    description: 'Free, private, browser-based online tools. No uploads, no signup.',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#fafafa', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0a0a0a', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
