<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_pillars_eyebrow') }}</p>
                <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('about_pillars_title') }}</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                <div
                    v-for="pillar in pillars"
                    :key="pillar.title"
                    class="text-center p-6 md:p-7 rounded-lg bg-white border border-border hover:shadow-md transition-shadow h-full"
                >
                    <div class="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mx-auto">
                        <component :is="pillar.icon" class="size-6 text-primary" />
                    </div>
                    <h3 class="font-display text-secondary text-base mt-4 font-medium">{{ pillar.title }}</h3>
                    <p class="text-primary/80 text-sm leading-relaxed mt-3">{{ pillar.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { LucideChartColumn, LucideCpu, LucideShield } from 'lucide-vue-next'

const { t } = useT()

const pillars = computed(() => [
    { icon: LucideChartColumn, title: t('about_pillars_1_title'), description: t('about_pillars_1_body') },
    { icon: LucideCpu, title: t('about_pillars_2_title'), description: t('about_pillars_2_body') },
    { icon: LucideShield, title: t('about_pillars_3_title'), description: t('about_pillars_3_body') },
])
</script>
