<template>
    <div>
        <ServicesHero />
        <DefaultFadeIn><ServicesDetail /></DefaultFadeIn>
        <DefaultFadeIn><ServicesCTA /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'services' })

useSeoMeta({
    title: 'Services - Hayyak',
    description: 'Comprehensive real estate services across the Levantine market.',
})
</script>
