<template>
    <div>
        <AboutHero />
        <DefaultFadeIn><AboutWelcome /></DefaultFadeIn>
        <DefaultFadeIn><AboutJointVenture /></DefaultFadeIn>
        <DefaultFadeIn><AboutPillars /></DefaultFadeIn>
        <DefaultFadeIn><AboutComparison /></DefaultFadeIn>
        <DefaultFadeIn><AboutCoverage /></DefaultFadeIn>
        <DefaultFadeIn><AboutFaq /></DefaultFadeIn>
        <DefaultFadeIn><AboutCareers /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'about' })

const { t } = useT()
useSeoMeta({
    title: () => t('seo_about_title'),
    description: () => t('seo_about_description'),
})
</script>
