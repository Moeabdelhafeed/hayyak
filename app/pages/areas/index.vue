<template>
    <div>
        <AreasHero />
        <DefaultFadeIn><AreasGrid /></DefaultFadeIn>
        <DefaultFadeIn><AreasDetail /></DefaultFadeIn>
        <DefaultFadeIn><AreasCTA /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'areas' })

useSeoMeta({
    title: 'Areas - Hayyak',
    description: "Detailed guides to Amman's most prestigious districts and Jordan's coastal living destinations.",
})
</script>
