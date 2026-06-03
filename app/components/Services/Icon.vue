<template>
    <img v-if="isUrl" :src="icon" :alt="alt" class="object-contain" v-bind="attrs">
    <component v-else-if="icon" :is="icon" v-bind="attrs" />
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    icon: { type: [String, Object, Function], default: null },
    alt: { type: String, default: '' },
})

const attrs = useAttrs()
// API gives icon URL strings; static fallback gives Lucide components
const isUrl = computed(() => typeof props.icon === 'string' && props.icon.length > 0)
</script>
