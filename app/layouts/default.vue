<template>
  <Html
    :lang="htmlLang"
    :dir="htmlDir"
    class="scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10 light"
  >
    <Body class="font-[Avenir_Next,Avenir,Nunito,sans-serif]">
      <NuxtLoadingIndicator color="#1E4A7C" :height="3" />
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-secondary focus:shadow-lg focus:outline-2 focus:outline-brand-orange"
      >
        {{ t('skip_to_content', 'Skip to main content') }}
      </a>
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
const { t } = useT()

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
  ogLocale: () => (locale.value === 'ar' ? 'ar_JO' : 'en_JO'),
  ogImage: '/og-image.jpg',
  twitterImage: '/og-image.jpg',
})

// Append the localized brand ("| Hayyak" / "| حياك"). Pages set only their own
// title (no brand); dedupe guards against an accidental double brand.
useHead({
  titleTemplate: (title) => {
    const brand = t('seo_brand', 'Hayyak')
    if (!title) return brand
    return /hayyak|حياك/i.test(title) ? title : `${title} | ${brand}`
  },
})

// Fonts loaded non-render-blocking: fetch as print stylesheet, swap to all on load.
// Split per locale — main.css uses Cairo only under [dir="rtl"] and Nunito/Jost only
// for LTR, so loading all three on both was ~40% wasted font CSS on every page.
// Weights trimmed to those actually used: the codebase has no font-extrabold (800)
// or font-black (900) anywhere, so 800/900 were downloaded and never rendered.
const isAr = computed(() => String(htmlLang.value).startsWith('ar'))
const FONTS_HREF = computed(() =>
  isAr.value
    ? 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap',
)

useHead(() => ({
  link: [
    // Every image and the hero video come from the CMS origin — open the socket
    // during HTML parse instead of paying DNS+TLS when the first <img> is hit.
    { rel: 'preconnect', href: 'https://cms.hayyakpm.com', crossorigin: '' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: FONTS_HREF.value, media: 'print', onload: "this.media='all'" },
  ],
  noscript: [{ innerHTML: `<link rel="stylesheet" href="${FONTS_HREF.value}">` }],
}))

// Global entity/identity structured data.
// Only ONE identity node: RealEstateAgent is already an Organization subtype, and
// declaring both defineOrganization and defineLocalBusiness merged them onto #identity
// while contributing `sameAs` twice — every social URL appeared duplicated.
const sameAs = computed(() => Object.values(social.value || {}).filter(Boolean))
// The brand name was hardcoded English on Arabic pages, so the AR structured data
// named a different entity than the AR page did.
const brandName = computed(() => (isAr.value ? 'حياك' : 'Hayyak'))
const brandAlt = computed(() => (isAr.value ? 'Hayyak' : 'حياك'))

useSchemaOrg([
  defineWebPage({ inLanguage: () => htmlLang.value }),
  defineLocalBusiness({
    '@type': 'RealEstateAgent',
    name: () => brandName.value,
    alternateName: () => brandAlt.value,
    logo: () => settings.value.logo_en || undefined,
    image: () => settings.value.logo_en || undefined,
    email: () => settings.value.app_email || undefined,
    telephone: () => settings.value.app_phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.96329657511428,
      longitude: 35.904837185578415,
    },
    openingHours: () => (settings.value.working_hours ? [settings.value.working_hours] : undefined),
    sameAs: () => sameAs.value,
  }),
  defineWebSite({ name: () => brandName.value, alternateName: () => brandAlt.value, inLanguage: () => htmlLang.value }),
])
</script>

<style scoped></style>
