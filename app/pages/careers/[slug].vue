<template>
    <div>
        <CareersDetail :job="job" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'career-detail' })

const route = useRoute()
const locale = useCookie('locale', { default: () => 'en' })

const { data } = await useFetch(`/api/careers/${route.params.slug}`, {
    watch: [locale],
    key: `career-${route.params.slug}`,
})
const job = computed(() => data.value?.data ?? {})

useSeoMeta({
    title: () => `${job.value?.meta_title || job.value?.title || 'Career'} - Hayyak`,
    description: () => clampMeta(job.value?.meta_description || job.value?.summary || ''),
})
</script>
