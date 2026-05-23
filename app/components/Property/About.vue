<template>
    <div>
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">{{ t('property_about_title') }}</h2>
        <div class="mt-3 border-s-2 border-brand-turquoise ps-4">
            <p class="text-brand-turquoise text-sm md:text-base leading-relaxed">
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    description: { type: String, required: true },
})
</script>
