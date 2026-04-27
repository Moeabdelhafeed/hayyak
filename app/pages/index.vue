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

useSeoMeta({
    title: 'Home - Hayyak',
    description: 'Hayyak',
    keywords: 'Hayyak',
    ogTitle: 'Hayyak',
    ogDescription: 'Hayyak',
    ogImage: 'Hayyak',
    ogUrl: 'Hayyak',
    ogType: 'website',
    twitterTitle: 'Hayyak',
    twitterDescription: 'Hayyak',
    twitterImage: 'Hayyak',
    twitterCard: 'summary_large_image',
})
</script>

<style  scoped>

</style>