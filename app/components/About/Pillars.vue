<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <p class="text-primary text-xs uppercase tracking-[0.15em]">Strategic Pillars</p>
                <h2 class="text-secondary text-2xl md:text-3xl mt-2 font-bold">How We Operate</h2>
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
                    <h3 class="text-secondary text-base mt-4 font-medium">{{ pillar.title }}</h3>
                    <p class="text-primary/80 text-sm leading-relaxed mt-3">{{ pillar.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { LucideChartColumn, LucideCpu, LucideShield } from 'lucide-vue-next'

const pillars = [
    {
        icon: LucideChartColumn,
        title: 'Financial Optimization',
        description: 'We treat every property as a strategic investment, utilizing rigorous rent collection and financial modelling to maximize Net Operating Income.',
    },
    {
        icon: LucideCpu,
        title: 'Operational Excellence',
        description: 'Our tech-enabled approach implements systematic preventive maintenance and digital reporting for asset longevity.',
    },
    {
        icon: LucideShield,
        title: 'Institutional Transparency',
        description: "Leveraging our banking-grade DNA, we provide owners with clear, real-time visibility into their property's performance.",
    },
]
</script>
