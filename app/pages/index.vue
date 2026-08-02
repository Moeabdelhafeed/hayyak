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

// og/twitter/canonical are auto-filled from title+description by @nuxtjs/seo (automaticDefaults).
useSeoMeta({
    title: 'Hayyak — Property Management & Real Estate in Jordan',
    description:
        "Discover, rent, and buy premium properties across Amman, Aqaba, and the Dead Sea — Hayyak's tech-enabled property management and advisory across Jordan.",
})
</script>

<style  scoped>

</style>