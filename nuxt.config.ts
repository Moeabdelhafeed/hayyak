import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Inline critical component CSS into the SSR HTML — reduces render-blocking requests.
  features: { inlineStyles: true },

  runtimeConfig: {
    baseUrl: 'https://cms.hayyakpm.com/api',
    publicToken: 'd3babb58f6cb937c004d43d654f542ec7cf55eacc20e57308d76199b0529cd7b549bc7f2f08ae979da6307de81d40a937737f4527f7b358d361d178896f169a5'
  },

  // Canonical production origin — powers @nuxtjs/seo canonical, OG url, sitemap, robots.
  // Non-www chosen as canonical; enforce www -> non-www 301 at the Hostinger/host level.
  site: {
    url: 'https://hayyakpm.com',
    name: 'Hayyak',
    defaultLocale: 'en',
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  css:[
    "~/assets/css/main.css",
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['@googlemaps/markerclusterer'],
    },
  },

  i18n: {
    baseUrl: 'https://hayyakpm.com',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English', dir: 'ltr' },
      { code: 'ar', language: 'ar-SA', file: 'ar.json', name: 'العربية', dir: 'rtl' }
    ],
    // Prefixed URLs: /en/... and /ar/... (both languages get a distinct crawlable URL).
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },

    shadcn: {
      /**
       * Prefix for all the imported component.
       * @default "Ui"
       */
      prefix: '',
      /**
       * Directory that the component lives in.
       * Will respect the Nuxt aliases.
       * @link https://nuxt.com/docs/api/nuxt-config#alias
       * @default "@/components/ui"
       */
      componentDir: '@/components/ui'
    },

    seo: {
      automaticDefaults: true
    },

  

  

  modules: [
    "@nuxtjs/i18n",
    'shadcn-nuxt',
    '@vueuse/nuxt',
    'nuxt-lucide-icons',
    'motion-v/nuxt',
    '@nuxtjs/seo',
    'v-gsap-nuxt',
    '@nuxt/scripts',
    '@nuxt/image',
  ],

  image: {
    // Remote CMS images (+ unsplash fallbacks) optimized to modern formats.
    domains: ['cms.hayyakpm.com', 'images.unsplash.com'],
    format: ['avif', 'webp'],
    quality: 70,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  scripts: {
    registry: {
      googleMaps: {
        // Key comes from NUXT_PUBLIC_SCRIPTS_GOOGLE_MAPS_API_KEY (.env) — never hard-code it.
        apiKey: process.env.NUXT_PUBLIC_SCRIPTS_GOOGLE_MAPS_API_KEY || '',
      },
    },
  },

  sitemap: {
    // CMS-driven detail pages (properties, areas, insights, services, careers, pages).
    sources: ['/api/__sitemap-urls'],
    // User-specific page — keep it out of the index.
    exclude: ['/en/favourites', '/ar/favourites'],
  },

  nitro: {
    // Pre-generate .gz/.br for built + public static assets so the Node server can
    // serve compressed responses even if the host edge doesn't compress.
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      // Long-lived immutable cache for hashed build assets.
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },
})
