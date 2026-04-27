<template>
    <section class="bg-white py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex justify-between items-end">
                <div>
                    <p class="text-primary/80 text-sm uppercase">
                        Market Insights
                    </p>
                    <h2 class="text-secondary text-2xl md:text-3xl mt-2 font-bold">
                        Latest Reports & Analysis
                    </h2>
                </div>
            </div>

            <div class="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <NuxtLink
                    v-for="report in reports"
                    :key="report.title"
                    :to="report.to"
                    class="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow group cursor-pointer h-full block"
                >
                    <span class="text-xs text-primary uppercase tracking-wider">{{ report.tag }}</span>
                    <h3 class="text-base mt-2 mb-2 text-secondary font-medium group-hover:text-primary transition-colors">
                        {{ report.title }}
                    </h3>
                    <p class="text-muted-foreground text-sm leading-relaxed mb-4">
                        {{ report.description }}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">{{ report.date }}</span>
                        <span class="text-primary text-sm flex items-center gap-1 group-hover:underline">
                            Read More
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
const reports = [
    {
        tag: 'Market Report',
        title: 'Jordan Real Estate Market Q4 2025',
        description: "Comprehensive analysis of residential and commercial property trends across Jordan's key markets.",
        date: 'December 2025',
        to: '/',
    },
    {
        tag: 'Price Index',
        title: 'Amman Residential Price Index',
        description: "Track residential property prices across Amman's premium neighbourhoods with our quarterly index.",
        date: 'January 2026',
        to: '/',
    },
    {
        tag: 'Investment Guide',
        title: 'Investment Outlook: Aqaba 2026',
        description: "Why Aqaba's tourism and economic development make it Jordan's fastest-growing investment destination.",
        date: 'February 2026',
        to: '/',
    },
]
</script>

<style scoped></style>
