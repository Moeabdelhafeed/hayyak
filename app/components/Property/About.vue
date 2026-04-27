<template>
    <div>
        <h2 class="text-secondary text-lg md:text-xl font-bold">About This Property</h2>
        <p class="text-primary text-sm md:text-base leading-relaxed mt-3">
            {{ description }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    description: { type: String, required: true },
})
</script>
