<template>
    <motion.div
        :initial="{ opacity: 0, y: 28 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }"
        :in-view-options="{ once: true, amount: 0.15 }"
    >
        <slot />
    </motion.div>
</template>

<script setup>
import { motion } from 'motion-v'

defineProps({
    delay: { type: Number, default: 0 },
})
</script>
