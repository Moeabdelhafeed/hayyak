<template>
    <section class="pt-8 md:pt-10 pb-12 md:pb-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto flex flex-col gap-8 md:gap-10">
            <div
                v-for="area in areas"
                :key="area.slug"
                :id="area.slug"
                class="bg-white rounded-lg border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-2 scroll-mt-32"
            >
                <div class="relative h-72 lg:h-auto min-h-[320px]">
                    <img :src="area.img" :alt="area.title" class="absolute inset-0 w-full h-full object-cover">
                    <div class="absolute top-4 start-4 bg-primary text-white text-xs uppercase tracking-wider px-3 py-1.5 rounded-md">
                        {{ area.count }} Properties
                    </div>
                </div>

                <div class="p-6 md:p-8">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ area.title }}</h2>
                            <p class="text-primary italic text-sm mt-1">{{ area.tag }}</p>
                        </div>
                        <span class="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap shrink-0">
                            {{ area.priceFrom }}
                        </span>
                    </div>

                    <p class="text-primary/80 text-sm leading-relaxed mt-4">{{ area.desc }}</p>

                    <div class="border-t border-border mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-primary uppercase tracking-wider font-medium">
                                <LucideUtensils class="size-3.5" />
                                Dining & Nightlife
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.dining" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-primary mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-primary uppercase tracking-wider font-medium">
                                <LucideShoppingBag class="size-3.5" />
                                Shopping & Lifestyle
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.shopping" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-primary mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-primary uppercase tracking-wider font-medium">
                                <LucideLandmark class="size-3.5" />
                                Key Landmarks
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.landmarks" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-primary mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-primary uppercase tracking-wider font-medium">
                                <LucideHouse class="size-3.5" />
                                Practical Info
                            </h4>
                            <p class="text-sm text-secondary/90 leading-relaxed mt-3">{{ area.practical }}</p>
                        </div>
                    </div>

                    <div v-if="area.perks.length" class="border-t border-border mt-6 pt-6">
                        <h4 class="font-display flex items-center gap-2 text-xs text-primary uppercase tracking-wider font-medium">
                            <LucideTag class="size-3.5" />
                            Resident Perks
                        </h4>
                        <div class="flex flex-wrap gap-3 mt-3">
                            <div
                                v-for="perk in area.perks"
                                :key="perk.name"
                                class="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
                            >
                                <div class="shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-md bg-primary text-white text-center">
                                    <span class="text-[13px] leading-none font-medium">{{ perk.pct }}</span>
                                    <span class="text-[9px] uppercase tracking-wide opacity-80 mt-0.5">off</span>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <p class="text-[13px] text-secondary font-medium">{{ perk.name }}</p>
                                        <span class="text-[10px] uppercase tracking-wider text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-sm">
                                            {{ perk.cat }}
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-primary/80 mt-1 leading-snug">{{ perk.desc }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <NuxtLink
                            :to="{ name: 'properties', query: { location: area.slug } }"
                            class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            View Properties in {{ area.title }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { areas } from './data'
</script>
