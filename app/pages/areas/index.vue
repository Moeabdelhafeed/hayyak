<template>
    <div>
        <AreasHero />
        <AreasDetail />
        <AreasCTA />
    </div>
</template>

<script setup>
definePageMeta({ name: 'areas' })

const { t } = useT()
useSeoMeta({
    title: () => t('seo_areas_title'),
    description: () => t('seo_areas_description'),
})
</script>
