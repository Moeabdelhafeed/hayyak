<template>
  <Html
    :lang="htmlLang"
    :dir="htmlDir"
    class="scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10 light"
  >
    <Body class="font-[Avenir_Next,Avenir,Nunito,sans-serif]">
      <NuxtLoadingIndicator color="#1E4A7C" :height="3" />
      <DefaultNavbar />
      <main id="main">
        <NuxtPage />
      </main>
      <DefaultFooter />
    </Body>
  </Html>
</template>

<script setup>
import { computed } from 'vue'

const { currentLang } = useLanguages()
const locale = useCookie('locale', { default: () => 'en', path: '/' })
const { settings, social } = useSettings()

const htmlLang = computed(() => currentLang.value?.locale || locale.value || 'en')
const htmlDir = computed(
  () => currentLang.value?.direction || (locale.value === 'ar' ? 'rtl' : 'ltr'),
)

// hreflang alternates (en/ar + x-default) and per-locale canonical, server-rendered.
const localeHead = useLocaleHead({ addSeoAttributes: true })
useHead(() => ({
  htmlAttrs: { lang: htmlLang.value, dir: htmlDir.value },
  link: localeHead.value?.link ?? [],
  meta: localeHead.value?.meta ?? [],
}))

// Site-wide social/meta defaults. Pages override title/description; these fill the rest.
useSeoMeta({
  ogSiteName: 'Hayyak',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  ogLocale: () => (locale.value === 'ar' ? 'ar_JO' : 'en_US'),
  ogImage: () => settings.value.logo_en || undefined,
  twitterImage: () => settings.value.logo_en || undefined,
})

// Brand the title once — pages already end in "- Hayyak", so only append when absent.
useHead({
  titleTemplate: (title) => {
    if (!title) return 'Hayyak'
    return /hayyak/i.test(title) ? title : `${title} | Hayyak`
  },
})

// Fonts loaded non-render-blocking: fetch as print stylesheet, swap to all on load.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Nunito:wght@300;400;500;600;700;800&family=Jost:wght@300;400;500;600;700&display=swap'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: FONTS_HREF, media: 'print', onload: "this.media='all'" },
  ],
  noscript: [{ innerHTML: `<link rel="stylesheet" href="${FONTS_HREF}">` }],
})

// Global entity/identity structured data (Organization + LocalBusiness merge on #identity).
const sameAs = computed(() => Object.values(social.value || {}).filter(Boolean))

useSchemaOrg([
  defineOrganization({
    name: 'Hayyak',
    logo: () => settings.value.logo_en || undefined,
    email: () => settings.value.app_email || undefined,
    telephone: () => settings.value.app_phone || undefined,
    sameAs: () => sameAs.value,
  }),
  defineLocalBusiness({
    '@type': 'RealEstateAgent',
    name: 'Hayyak',
    logo: () => settings.value.logo_en || undefined,
    image: () => settings.value.logo_en || undefined,
    email: () => settings.value.app_email || undefined,
    telephone: () => settings.value.app_phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    openingHours: () => (settings.value.working_hours ? [settings.value.working_hours] : undefined),
    sameAs: () => sameAs.value,
  }),
  defineWebSite({ name: 'Hayyak' }),
])
</script>

<style scoped></style>
