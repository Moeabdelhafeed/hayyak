<template>
    <section class="bg-secondary text-white py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <p class="text-primary-light text-sm uppercase">
                        Why Hayyak
                    </p>
                    <h2 class="font-display text-2xl md:text-3xl mt-2 font-bold text-white">
                        Banking-Grade Governance. Hospitality-Grade Service.
                    </h2>
                    <p class="text-white/60 mt-6 leading-relaxed">
                        Unlike traditional agencies, Hayyak integrates advisory, management, leasing, and sales into one platform. Backed by Jordan's largest financial institutions, we bring institutional discipline to every property we manage.
                    </p>

                    <div class="flex flex-col gap-4 mt-8">
                        <div
                            v-for="point in points"
                            :key="point"
                            class="flex items-center gap-3"
                        >
                            <LucideCircleCheck class="size-5 text-primary-light shrink-0" />
                            <span class="text-white/80 text-sm">{{ point }}</span>
                        </div>
                    </div>

                    <NuxtLink
                        :to="{ name: 'about' }"
                        class="inline-flex items-center gap-2 mt-8 text-primary-light hover:text-white transition-colors text-sm"
                    >
                        Learn More About Us
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
const points = [
    'Preventive maintenance, not reactive repairs',
    'Digital tracking & institutional reporting',
    'Long-term asset strategy & optimization',
    "Backed by Jordan's largest banks",
]

const stats = [
    { value: '500K+', label: 'Sq. Meters Managed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '200+', label: 'Properties' },
    { value: '15+', label: 'Years Experience' },
]
</script>

<style scoped></style>
