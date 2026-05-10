<template>
    <div>
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">Features &amp; Amenities</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
            <li
                v-for="f in features"
                :key="f"
                class="flex items-center gap-2 text-primary text-sm"
            >
                <LucideCircleCheck class="size-4 text-primary shrink-0" />
                {{ f }}
            </li>
        </ul>
    </div>
</template>

<script setup>
defineProps({
    features: { type: Array, required: true },
})
</script>
