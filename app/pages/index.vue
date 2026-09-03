<template>
    <div>
        <HomeHero />
        <DefaultFadeIn><HomeFeatured /></DefaultFadeIn>
        <DefaultFadeIn><HomeServices /></DefaultFadeIn>
        <DefaultFadeIn><HomeAreas /></DefaultFadeIn>
        <DefaultFadeIn><HomeWhyUs /></DefaultFadeIn>
        <DefaultFadeIn><HomeInsights /></DefaultFadeIn>
        <DefaultFadeIn><HomeCTA /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'home' })

const { t } = useT()
// Title gets the localized brand appended by the layout titleTemplate.
useSeoMeta({
    title: () => t('seo_home_title'),
    description: () => t('seo_home_description'),
})
</script>

<style  scoped>

</style>