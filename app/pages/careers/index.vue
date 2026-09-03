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
    title: () => t('seo_careers_title'),
    description: () => t('seo_careers_description'),
})
</script>
