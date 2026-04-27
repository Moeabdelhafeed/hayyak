<template>
    <div class="bg-white border border-border rounded-xl p-5 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
        <div v-for="d in details" :key="d.label">
            <p class="text-primary text-xs uppercase tracking-wider">{{ d.label }}</p>
            <p class="text-secondary text-sm font-medium mt-1">{{ d.value }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    property: { type: Object, required: true },
})

const details = computed(() => [
    { label: 'Floor', value: props.property.floor },
    { label: 'Year Built', value: props.property.yearBuilt },
    { label: 'Furnishing', value: props.property.furnishing },
    { label: 'Type', value: props.property.type },
    { label: 'Listing', value: props.property.listing },
    { label: 'Reference', value: props.property.reference },
])
</script>
