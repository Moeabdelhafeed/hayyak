<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <p class="text-primary text-xs uppercase tracking-[0.15em]">An Unmatched Foundation</p>
                <h2 class="text-secondary text-2xl md:text-3xl mt-2 font-bold">A Strategic Joint Venture</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
                <div
                    v-for="entity in entities"
                    :key="entity.title"
                    class="bg-white p-6 md:p-7 rounded-lg border border-border h-full"
                >
                    <div class="w-12 h-12 rounded-md bg-primary/8 flex items-center justify-center">
                        <component :is="entity.icon" class="size-6 text-primary" />
                    </div>
                    <h3 class="text-secondary font-bold text-lg mt-4 ">{{ entity.title }}</h3>
                    <p class="text-primary/80 text-sm leading-relaxed mt-3">
                        {{ entity.description }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { LucideLandmark, LucideBuilding } from 'lucide-vue-next'

const entities = [
    {
        icon: LucideLandmark,
        title: 'Thabat',
        description: 'A private shareholder company owned by some of the largest banks in Jordan. Provides institutional governance, financial security, and long-term stability for large-scale portfolios.',
    },
    {
        icon: LucideBuilding,
        title: 'Bright Levant',
        description: 'A specialized real estate asset manager with a distinguished track record across the Gulf and Jordan. Deep market intelligence and sophisticated asset life-cycle management.',
    },
]
</script>
