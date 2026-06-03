<template>
    <div v-if="description || descriptionHtml">
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">{{ t('property_about_title') }}</h2>
        <div class="mt-3 border-s-2 border-brand-turquoise ps-4">
            <div
                v-if="descriptionHtml"
                class="prose prose-sm md:prose-base text-brand-turquoise leading-relaxed [&_ul]:list-disc [&_ul]:ps-5 [&_li]:my-1"
                v-html="descriptionHtml"
            />
            <p v-else class="text-brand-turquoise text-sm md:text-base leading-relaxed whitespace-pre-line">
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    description: { type: String, default: '' },
    descriptionHtml: { type: String, default: '' },
})
</script>
