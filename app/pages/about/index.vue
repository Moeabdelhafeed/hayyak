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

useSeoMeta({
    title: 'About - Hayyak',
    description: 'Hayyak is the premier, tech-enabled property management division of Thabat.',
})
</script>
