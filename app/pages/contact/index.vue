<template>
    <div>
        <ContactHero />
        <DefaultFadeIn><ContactForm /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'contact' })

useSeoMeta({
    title: 'Contact - Hayyak',
    description: 'Get in touch with Hayyak for property management, leasing, and advisory services.',
})
</script>
