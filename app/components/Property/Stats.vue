<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
            v-for="(s, i) in stats"
            :key="s.label"
            class="bg-white border border-border rounded-xl p-5 flex flex-col items-center text-center"
            :initial="{ opacity: 0, y: 24 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="{ once: true, amount: 0.3 }"
            :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }"
        >
            <component :is="s.icon" class="size-5 text-primary" />
            <p class="text-secondary text-lg font-bold mt-2">
                <DefaultCountUp :to="s.value" :suffix="s.suffix" />
            </p>
            <p class="text-primary text-xs tracking-wider mt-1">{{ s.label }}</p>
        </motion.div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { LucideBed, LucideBath, LucideMaximize, LucideCar } from 'lucide-vue-next'

const props = defineProps({
    property: { type: Object, required: true },
})

const stats = computed(() => [
    { label: 'Bedrooms', value: Number(props.property.bedrooms), suffix: '', icon: LucideBed },
    { label: 'Bathrooms', value: Number(props.property.bathrooms), suffix: '', icon: LucideBath },
    { label: 'Area', value: Number(props.property.area), suffix: ' sqm', icon: LucideMaximize },
    { label: 'Parking', value: Number(props.property.parking), suffix: '', icon: LucideCar },
])
</script>
