<template>
    <div>
        <ServicesHero />
        <DefaultFadeIn><ServicesDetail /></DefaultFadeIn>
        <DefaultFadeIn><ServicesCTA /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'services' })

const { t } = useT()
useSeoMeta({
    title: () => t('seo_services_title'),
    description: () => t('seo_services_description'),
})
</script>
