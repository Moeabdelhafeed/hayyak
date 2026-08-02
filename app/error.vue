<template>
  <Html :lang="htmlLang" :dir="htmlDir">
    <div class="min-h-screen flex flex-col items-center justify-center bg-[#f8fafb] px-4 text-center">
      <p class="font-display text-brand-turquoise text-7xl sm:text-8xl font-bold">{{ code }}</p>
      <h1 class="font-display text-secondary text-2xl sm:text-3xl font-bold mt-4">
        {{ isNotFound ? t('error_404_title', 'Page not found') : t('error_generic_title', 'Something went wrong') }}
      </h1>
      <p class="text-primary/80 text-sm sm:text-base mt-3 max-w-md">
        {{ isNotFound
          ? t('error_404_body', "The page you're looking for doesn't exist or has been moved.")
          : t('error_generic_body', 'An unexpected error occurred. Please try again.') }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 mt-8">
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-turquoise text-white text-sm font-medium hover:bg-brand-turquoise/90 transition-colors"
          @click="goHome"
        >
          <LucideHome class="size-4" />
          {{ t('error_back_home', 'Back to home') }}
        </button>
        <NuxtLinkLocale
          :to="{ name: 'properties' }"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-turquoise/40 text-brand-turquoise text-sm font-medium hover:bg-brand-turquoise/10 transition-colors"
          @click="clearError"
        >
          {{ t('nav_properties', 'Properties') }}
          <LucideArrowRight class="size-4 rtl:rotate-180" />
        </NuxtLinkLocale>
      </div>
    </div>
  </Html>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ error: { type: Object, default: () => ({}) } })

const { t, locale } = useT()

const code = computed(() => props.error?.statusCode || 404)
const isNotFound = computed(() => code.value === 404)

const htmlLang = computed(() => (locale.value === 'ar' ? 'ar' : 'en'))
const htmlDir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const goHome = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => t('error_404_title', 'Page not found'),
  robots: 'noindex, follow',
})
</script>
