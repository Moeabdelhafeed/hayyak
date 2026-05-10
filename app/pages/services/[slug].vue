<template>
    <div v-if="service">
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
                <nav class="flex items-center gap-2 text-sm text-white/60">
                    <NuxtLink :to="{ name: 'home' }" class="hover:text-white transition-colors">Home</NuxtLink>
                    <LucideChevronRight class="size-3.5 rtl:rotate-180" />
                    <NuxtLink :to="{ name: 'services' }" class="hover:text-white transition-colors">Services</NuxtLink>
                    <LucideChevronRight class="size-3.5 rtl:rotate-180" />
                    <span class="text-white">{{ service.title }}</span>
                </nav>

                <p class="text-primary-light text-xs uppercase tracking-[0.15em] mt-6">{{ service.hero.eyebrow }}</p>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-3xl">
                    <span v-for="(part, i) in titleParts" :key="i" :class="part === service.hero.highlight ? 'text-primary-light italic' : ''">
                        {{ part }}{{ i < titleParts.length - 1 ? ' ' : '' }}
                    </span>
                </h1>
                <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ service.hero.sub }}
                </p>

                <div class="grid grid-cols-3 mt-10 max-w-2xl border border-white/10 rounded-lg overflow-hidden">
                    <div
                        v-for="s in service.stats"
                        :key="s.label"
                        class="px-5 py-4 border-r last:border-r-0 border-white/10"
                    >
                        <p class="text-primary-light text-xl md:text-2xl font-bold">{{ s.value }}</p>
                        <p class="text-white/60 text-xs uppercase tracking-wider mt-1">{{ s.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <DefaultFadeIn v-for="(section, i) in service.sections" :key="i">
            <section class="py-12 md:py-20" :class="i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafb]'">
                <div class="px-4 max-w-[1350px] mx-auto">
                    <p class="text-primary text-xs uppercase tracking-[0.15em] font-medium">{{ section.eyebrow }}</p>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold mt-2 max-w-3xl">{{ section.title }}</h2>
                    <p v-if="section.intro" class="text-primary text-sm md:text-base leading-relaxed mt-3 max-w-2xl">{{ section.intro }}</p>

                    <div v-if="section.type === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                        <div
                            v-for="item in section.items"
                            :key="item.title"
                            class="bg-white border border-border rounded-lg p-5 md:p-6"
                        >
                            <div class="size-10 rounded-md bg-primary/10 flex items-center justify-center">
                                <component :is="item.icon" class="size-5 text-primary" />
                            </div>
                            <h3 class="font-display text-secondary text-lg font-bold mt-4">{{ item.title }}</h3>
                            <p class="text-primary text-sm leading-relaxed mt-2">{{ item.body }}</p>
                            <div v-if="item.tags" class="flex flex-wrap gap-2 mt-4">
                                <span v-for="t in item.tags" :key="t" class="text-[11px] uppercase tracking-wider px-2 py-1 rounded bg-primary/8 text-primary">{{ t }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'lifecycle'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
                        <div
                            v-for="step in section.steps"
                            :key="step.label"
                            class="bg-white border border-border rounded-lg p-4 text-center"
                        >
                            <div class="size-10 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                                <component :is="step.icon" class="size-4 text-primary" />
                            </div>
                            <p class="text-secondary text-sm font-semibold mt-3">{{ step.label }}</p>
                            <p class="text-primary text-xs mt-1">{{ step.desc }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'phases'" class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <div
                            v-for="phase in section.items"
                            :key="phase.num"
                            class="bg-white border border-border rounded-lg p-6"
                        >
                            <p class="text-primary-light text-3xl font-bold italic">{{ phase.num }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-2">{{ phase.title }}</h3>
                            <p class="text-primary text-sm leading-relaxed mt-3">{{ phase.body }}</p>
                            <ul class="flex flex-col gap-1.5 mt-4">
                                <li v-for="b in phase.items" :key="b" class="text-primary/80 text-sm flex gap-2">
                                    <span class="text-primary">—</span>
                                    {{ b }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'deliverables'" class="bg-white border border-border rounded-lg overflow-hidden mt-8">
                        <div class="hidden md:grid grid-cols-[2fr_3fr_1fr_1.2fr] bg-primary/5 text-primary text-xs uppercase tracking-wider font-semibold">
                            <div class="px-4 py-3">Document</div>
                            <div class="px-4 py-3">Description</div>
                            <div class="px-4 py-3">Phase</div>
                            <div class="px-4 py-3">Frequency</div>
                        </div>
                        <div
                            v-for="row in section.rows"
                            :key="row.doc"
                            class="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_1.2fr] border-t border-border"
                        >
                            <div class="px-4 py-3 text-secondary text-sm font-semibold">{{ row.doc }}</div>
                            <div class="px-4 py-3 text-primary text-sm">{{ row.desc }}</div>
                            <div class="px-4 py-3 text-primary text-xs uppercase tracking-wider">{{ row.phase }}</div>
                            <div class="px-4 py-3 text-primary text-sm">{{ row.frequency }}</div>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'standards'" class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <div
                            v-for="item in section.items"
                            :key="item.title"
                            class="bg-white border border-border rounded-lg p-6"
                        >
                            <p class="text-primary text-xs uppercase tracking-wider font-medium">{{ item.label }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-2">{{ item.title }}</h3>
                            <p class="text-primary text-sm leading-relaxed mt-3">{{ item.body }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'process'" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div
                            v-for="item in section.items"
                            :key="item.phase"
                            class="border-s-2 border-primary/30 ps-5"
                        >
                            <p class="text-primary text-xs uppercase tracking-wider font-medium italic">{{ item.phase }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-1">{{ item.title }}</h3>
                            <p class="text-primary text-sm leading-relaxed mt-2">{{ item.body }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'timeline'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-8 border border-border rounded-lg overflow-hidden bg-white">
                        <div
                            v-for="(item, idx) in section.items"
                            :key="item.num"
                            :class="['p-6', idx < section.items.length - 1 ? 'lg:border-r border-border' : '', idx < section.items.length - 1 ? 'border-b lg:border-b-0' : '']"
                        >
                            <p class="text-primary-light text-3xl font-bold italic">{{ item.num }}</p>
                            <h3 class="font-display text-secondary text-base font-bold mt-2">{{ item.title }}</h3>
                            <p class="text-primary text-sm leading-relaxed mt-2">{{ item.body }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultFadeIn>

        <DefaultFadeIn>
            <DefaultCta
                :eyebrow="service.cta.eyebrow"
                :title="service.cta.title"
                primary-label="Contact Our Team"
                secondary-label="View All Services"
                :secondary-to="{ name: 'services' }"
            />
        </DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { services } from '@/components/Services/data'

definePageMeta({ name: 'service-detail' })

const route = useRoute()
const service = computed(() => services.find((s) => s.slug === route.params.slug))

const titleParts = computed(() => {
    if (!service.value?.hero?.title) return []
    const t = service.value.hero.title
    const h = service.value.hero.highlight
    if (!h) return [t]
    return t.split(h).flatMap((part, i, arr) => i < arr.length - 1 ? [part.trim(), h] : [part.trim()]).filter(Boolean)
})

useSeoMeta({
    title: computed(() => `${service.value?.title || 'Service'} - Hayyak`),
    description: computed(() => service.value?.desc),
})
</script>
