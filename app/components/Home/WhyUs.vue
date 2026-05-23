<template>
    <section class="bg-secondary text-white py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <p class="text-brand-cyan-neon text-sm uppercase tracking-wider">
                        {{ t('home_whyus_eyebrow') }}
                    </p>
                    <h2 class="font-display text-2xl md:text-3xl mt-2 font-bold text-white">
                        {{ t('home_whyus_title') }}
                    </h2>
                    <p class="text-white/60 mt-6 leading-relaxed">
                        {{ t('home_whyus_body') }}
                    </p>

                    <div class="flex flex-col gap-4 mt-8">
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

                <div class="grid grid-cols-2 gap-4 md:gap-5">
                    <div
                        v-for="(stat, i) in stats"
                        :key="stat.label"
                        :class="[
                            'rounded-lg p-6 sm:p-8 text-center transition-all',
                            i === 1 || i === 2
                                ? 'bg-primary'
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

const points = computed(() => [
    t('home_whyus_point_1'),
    t('home_whyus_point_2'),
    t('home_whyus_point_3'),
    t('home_whyus_point_4'),
])

const stats = computed(() => [
    { value: t('home_whyus_stat_sqm_value'), label: t('home_whyus_stat_sqm_label') },
    { value: t('home_whyus_stat_satisfaction_value'), label: t('home_whyus_stat_satisfaction_label') },
    { value: t('home_whyus_stat_properties_value'), label: t('home_whyus_stat_properties_label') },
    { value: t('home_whyus_stat_experience_value'), label: t('home_whyus_stat_experience_label') },
])
</script>

<style scoped></style>
