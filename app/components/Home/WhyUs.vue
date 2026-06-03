<template>
    <section v-if="hasContent" class="bg-secondary text-white py-12 md:py-20 relative overflow-hidden">
        <div class="grid-bg absolute inset-0 pointer-events-none"></div>
        <div class="px-4 max-w-[1350px] mx-auto relative">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <p v-if="whyEyebrow" class="text-brand-cyan-neon text-sm uppercase tracking-wider">
                        {{ whyEyebrow }}
                    </p>
                    <h2 v-if="whyTitle || whyAccent" class="font-display text-3xl md:text-5xl mt-4 font-bold text-white leading-[1.1]">
                        {{ whyTitle }}
                        <span class="text-brand-cyan-neon">{{ whyAccent }}</span>
                    </h2>
                    <p v-if="whyBody" class="text-white/60 mt-6 leading-relaxed">
                        {{ whyBody }}
                    </p>

                    <div v-if="points.length" class="flex flex-col gap-4 mt-8">
                        <div
                            v-for="point in points"
                            :key="point"
                            class="flex items-center gap-3"
                        >
                            <LucideCircleCheck class="size-5 text-brand-cyan-neon shrink-0" />
                            <span class="text-white/80 text-sm">{{ point }}</span>
                        </div>
                    </div>

                    <NuxtLink
                        :to="{ name: 'about' }"
                        class="inline-flex items-center gap-2 mt-8 text-brand-cyan-neon hover:text-white transition-colors text-sm"
                    >
                        {{ t('home_whyus_learn_more') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>

                <div v-if="stats.length" class="grid grid-cols-2 gap-4 md:gap-5">
                    <div
                        v-for="(stat, i) in stats"
                        :key="stat.label"
                        :class="[
                            'rounded-lg p-6 sm:p-8 text-center transition-all',
                            i === 1 || i === 2
                                ? 'bg-brand-turquoise'
                                : 'bg-white/5 border border-white/10'
                        ]"
                    >
                        <p class="text-3xl sm:text-4xl text-white font-bold">{{ stat.value }}</p>
                        <p class="text-white/70 text-sm mt-1">{{ stat.label }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const { home } = useHome()

const why = computed(() => home.value.why_us ?? {})
const whyEyebrow = computed(() => why.value.eyebrow || '')
const whyTitle = computed(() => why.value.title || '')
const whyAccent = computed(() => why.value.title_accent || '')
const whyBody = computed(() => why.value.body || '')
const points = computed(() => why.value.points ?? [])
const stats = computed(() => (why.value.stats ?? []).map(s => ({ value: s.value || '', label: s.label || '' })))

const hasContent = computed(() => !!(
    whyTitle.value || whyBody.value || whyEyebrow.value || points.value.length || stats.value.length
))
</script>

<style scoped>
.grid-bg {
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
}
</style>
