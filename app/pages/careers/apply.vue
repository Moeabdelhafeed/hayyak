<template>
    <div>
        <CareersApply />
    </div>
</template>

<script setup>
definePageMeta({ name: 'career-apply' })

const { t } = useT()

// A bare application form: no unique content to rank, and @nuxtjs/seo's automatic
// defaults were inferring the English route name as the title on Arabic pages too.
useSeoMeta({
    title: () => t('seo_careers_apply_title', 'Apply for a Role'),
    description: () => t('seo_careers_apply_description', 'Submit your application to join the Hayyak team.'),
    robots: 'noindex, follow',
})
</script>
