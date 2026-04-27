<template>
    <span ref="el">{{ display }}{{ suffix }}</span>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const props = defineProps({
    to: { type: Number, required: true },
    duration: { type: Number, default: 1500 },
    suffix: { type: String, default: '' },
    decimals: { type: Number, default: 0 },
})

const el = ref(null)
const display = ref(0)
const visible = useElementVisibility(el)
let raf = 0
let started = false

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

const run = () => {
    cancelAnimationFrame(raf)
    const start = performance.now()
    const tick = (now) => {
        const t = Math.min(1, (now - start) / props.duration)
        const v = props.to * easeOut(t)
        display.value = Number(v.toFixed(props.decimals))
        if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
}

watch(visible, (v) => {
    if (v && !started) {
        started = true
        run()
    }
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>
