import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Inline critical component CSS into the SSR HTML — reduces render-blocking requests.
  features: { inlineStyles: true },

  runtimeConfig: {
    baseUrl: 'https://cms.hayyakpm.com/api',
    publicToken:
      'd3babb58f6cb937c004d43d654f542ec7cf55eacc20e57308d76199b0529cd7b549bc7f2f08ae979da6307de81d40a937737f4527f7b358d361d178896f169a5',
    public: {
      // Public token — set via .env.
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || '',
      // GSC token is case-sensitive; the host uppercases env values, so it's
      // hardcoded here (it's a public string that renders in the page anyway).
      gscVerification: 'I_ujW4aHHRCnnqbdfb0NtEgpi11-taRh4UYbw2qiJ24',
    },
  },

  // Canonical production origin — powers @nuxtjs/seo canonical, OG url, sitemap, robots.
  // Non-www chosen as canonical; enforce www -> non-www 301 at the Hostinger/host level.
  site: {
    url: 'https://hayyakpm.com',
    name: 'Hayyak',
    defaultLocale: 'en',
  },

  app: {
    head: {
      // Google Search Console verification — literal (case-sensitive), so no env
      // var or layout change can drop or override it.
      meta: [
        { name: 'google-site-verification', content: 'I_ujW4aHHRCnnqbdfb0NtEgpi11-taRh4UYbw2qiJ24' },
      ],
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@googlemaps/markerclusterer'],
    },
  },

  i18n: {
    baseUrl: 'https://hayyakpm.com',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English', dir: 'ltr' },
      { code: 'ar', language: 'ar-SA', file: 'ar.json', name: 'العربية', dir: 'rtl' },
    ],
    // Prefixed URLs: /en/... and /ar/... (both languages get a distinct crawlable URL).
    strategy: 'prefix',
    // Root '/' permanently (301) redirects to the default locale.
    rootRedirect: { statusCode: 301, path: 'en' },
    // Browser-language auto-redirect off so '/' is a clean, permanent 301 (not a 302).
    detectBrowserLanguage: false,
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
    componentDir: '@/components/ui',
  },

  seo: {
    automaticDefaults: true,
  },

  modules: [
    '@nuxtjs/i18n',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    'nuxt-lucide-icons',
    'motion-v/nuxt',
    '@nuxtjs/seo',
    '@nuxt/scripts',
    '@nuxt/image',
  ],

  image: {
    // Remote CMS images (+ unsplash fallbacks) optimized to modern formats.
    domains: ['cms.hayyakpm.com', 'images.unsplash.com'],
    // NOTE: `format` and `quality` here are defaults for the module's own helpers, not
    // modifiers stamped onto every generated URL — measured: the hero LCP image came
    // back as /_ipx/w_768&q_70/… served image/jpeg (49KB vs 38KB as webp). `presets`
    // don't help either; a preset only applies when a component asks for it by name.
    // So every <NuxtImg> that can take a jpg/png source carries format="webp" itself.
    format: 'webp',
    quality: 70,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  scripts: {
    registry: {
      googleMaps: {
        // Hardcoded so the host env can't override it with a wrong value.
        // Public key (rendered client-side) — restrict it by HTTP referrer in Google Cloud.
        apiKey: 'AIzaSyAZPEsDRG2FCWOhlL0hwkeyEVPjXQg3bPs',
      },
    },
  },

  sitemap: {
    // CMS-driven detail pages (properties, areas, insights, services, careers, pages).
    sources: ['/api/__sitemap-urls'],
    // User-specific and no-unique-content pages — keep them out of the index.
    exclude: ['/en/favourites', '/ar/favourites', '/en/careers/apply', '/ar/careers/apply'],
  },

  // The page-level `swr` rules below write to a filesystem cache in dev
  // (.nuxt/cache/nuxt/payload), where `/en` is stored as a FILE named `en` — which
  // then makes `/en/about` fail with ENOTDIR because `en` cannot also be a directory.
  // Production uses a different cache storage and is unaffected, and swr buys nothing
  // in dev anyway, so it is off there.
  $development: {
    nitro: {
      routeRules: {
        '/en/**': { swr: false },
        '/ar/**': { swr: false },
      },
    },
  },

  nitro: {
    // Pre-generate .gz/.br for built + public static assets so the Node server can
    // serve compressed responses even if the host edge doesn't compress.
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      // Long-lived immutable cache for hashed build assets.
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // Stale-while-revalidate the CMS-driven public pages. Two wins: TTFB drops from
      // a 1-3s origin render to a cache hit, and a flaky upstream can no longer put an
      // empty 200 in front of a crawler — the last good render is served instead.
      '/en/**': { swr: 300 },
      '/ar/**': { swr: 300 },
      // Per-user page (favourites live in browser storage) — never cache it.
      '/en/favourites': { swr: false },
      '/ar/favourites': { swr: false },
    },
  },
})
