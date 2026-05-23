<template>
    <div>
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">{{ t('property_about_title') }}</h2>
        <p class="text-primary text-sm md:text-base leading-relaxed mt-3">
            {{ description }}
        </p>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    description: { type: String, required: true },
})
</script>
