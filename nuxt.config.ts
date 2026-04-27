import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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