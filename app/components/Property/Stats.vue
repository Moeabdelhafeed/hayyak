<template>
    <div class="grid grid-cols-2 gap-3" :class="gridClass">
        <motion.div
            v-for="(s, i) in stats"
            :key="s.label"
            class="group bg-white border border-brand-turquoise/15 rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-turquoise/40 hover:bg-brand-turquoise/5 transition-colors"
            :initial="{ opacity: 0, y: 24 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="{ once: true, amount: 0.3 }"
            :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }"
        >
            <div class="size-10 rounded-full bg-brand-turquoise/10 group-hover:bg-brand-turquoise flex items-center justify-center transition-colors">
                <component :is="s.icon" class="size-5 text-brand-turquoise group-hover:text-white transition-colors" />
            </div>
            <p class="text-secondary text-lg font-bold mt-3">
                <DefaultCountUp :to="s.value" :suffix="s.suffix" />
            </p>
            <p class="text-brand-turquoise text-xs tracking-wider mt-1">{{ s.label }}</p>
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

const { t } = useT()

const stats = computed(() => [
    { label: t('property_stats_bedrooms'), value: Number(props.property.bedrooms), suffix: '', icon: LucideBed },
    { label: t('property_stats_bathrooms'), value: Number(props.property.bathrooms), suffix: '', icon: LucideBath },
    { label: t('property_stats_area'), value: Number(props.property.area), suffix: ' sqm', icon: LucideMaximize },
    { label: t('property_stats_parking'), value: Number(props.property.parking), suffix: '', icon: LucideCar },
].filter(s => Number.isFinite(s.value) && s.value !== 0))

// full class names so Tailwind keeps them
const gridClass = computed(() => ({
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
}[stats.value.length] || 'md:grid-cols-4'))
</script>
