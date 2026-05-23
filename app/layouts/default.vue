<template>
    <Html :lang="htmlLang" :dir="htmlDir" class="scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10 light">
      <Head>
         <link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Nunito:wght@300;400;500;600;700;800&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </Head>
      <Body class="font-[Avenir_Next,Avenir,Nunito,sans-serif]">
        <NuxtLoadingIndicator color="#1E4A7C" :height="3" />
        <DefaultNavbar />
        <NuxtPage />
        <DefaultFooter />
      </Body>
    </Html>
</template>

<script setup>
import { computed } from 'vue'

const { currentLang } = useLanguages()
const locale = useCookie('locale', { default: () => 'en', path: '/' })

const htmlLang = computed(() => currentLang.value?.locale || locale.value || 'en')
const htmlDir = computed(() => currentLang.value?.direction || (locale.value === 'ar' ? 'rtl' : 'ltr'))
</script>

<style scoped></style>
