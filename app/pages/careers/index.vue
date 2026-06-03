<template>
    <div>
        <CareersHero />
        <CareersList />
    </div>
</template>

<script setup>
definePageMeta({ name: 'careers' })

const { t } = useT()
useSeoMeta({
    title: () => `${t('careers_hero_title')} - Hayyak`,
    description: () => t('careers_hero_subtitle'),
})
</script>
