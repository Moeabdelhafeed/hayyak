<template>
    <div>
        <CareersDetail :job="job" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'career-detail' })

const { t } = useT()
const route = useRoute()
const locale = useCookie('locale', { default: () => 'en' })

const { data, error } = await useFetch(`/api/careers/${route.params.slug}`, {
    watch: [locale],
    key: computed(() => `career-${route.params.slug}-${locale.value}`),
})
const job = computed(() => data.value?.data ?? {})

requireRecord(data.value?.data, error)

useSeoMeta({
    title: () => job.value?.meta_title || job.value?.title || t('seo_career_fallback_title', 'Career'),
    description: () => clampMeta(job.value?.meta_description || job.value?.summary || ''),
})
</script>
