import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    baseUrl: 'https://hayyak-cms.dottechjo.com/api',
    publicToken: 'd3babb58f6cb937c004d43d654f542ec7cf55eacc20e57308d76199b0529cd7b549bc7f2f08ae979da6307de81d40a937737f4527f7b358d361d178896f169a5'
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
    ]
  },

  i18n: {
    baseUrl: 'https://localhost:3000',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English', dir: 'ltr' },
      { code: 'ar', language: 'ar-SA', file: 'ar.json', name: 'العربية', dir: 'rtl' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
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
      automaticDefaults: false
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
  ],

  scripts: {
    registry: {
      googleMaps: {
        apiKey: '',
      },
    },
  },
})