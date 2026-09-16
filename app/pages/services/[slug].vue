<template>
    <div v-if="service">
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: t('nav_services', 'Services'), to: { name: 'services' } },
                        { name: service.title },
                    ]"
                    class="text-sm text-white/60"
                />

                <p v-if="service.hero?.eyebrow" class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em] mt-6">{{ service.hero.eyebrow }}</p>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-3xl">
                    <span v-for="(part, i) in titleParts" :key="i" :class="part === service.hero.highlight ? 'text-brand-cyan-neon italic' : ''">
                        {{ part }}{{ i < titleParts.length - 1 ? ' ' : '' }}
                    </span>
                </h1>
                <p v-if="service.hero?.sub" class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ service.hero.sub }}
                </p>

                <div v-if="service.stats?.length" class="grid grid-cols-3 mt-10 max-w-2xl border border-white/10 rounded-lg overflow-hidden">
                    <div
                        v-for="s in service.stats"
                        :key="s.label"
                        class="px-5 py-4 border-e last:border-e-0 border-white/10"
                    >
                        <p class="text-brand-cyan-neon text-xl md:text-2xl font-bold">{{ s.value }}</p>
                        <p class="text-white/60 text-xs uppercase tracking-wider mt-1">{{ s.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <DefaultFadeIn v-for="(section, i) in service.sections" :key="i">
            <section class="py-12 md:py-20" :class="i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafb]'">
                <div class="px-4 max-w-[1350px] mx-auto">
                    <p class="text-brand-turquoise text-xs uppercase tracking-[0.15em] font-medium">{{ section.eyebrow }}</p>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold mt-2 max-w-3xl">{{ section.title }}</h2>
                    <p v-if="section.intro" class="text-brand-turquoise/80 text-sm md:text-base leading-relaxed mt-3 max-w-2xl">{{ section.intro }}</p>

                    <div v-if="section.type === 'cards'" class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                        <div
                            v-for="(item, idx) in section.items"
                            :key="item.title"
                            class="group bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-5 md:p-6 hover:bg-brand-turquoise/10 hover:border-brand-turquoise/40 transition-colors"
                        >
                            <div class="flex items-start justify-between">
                                <p class="text-brand-turquoise/30 group-hover:text-brand-turquoise/60 text-3xl font-bold italic transition-colors">{{ String(idx + 1).padStart(2, '0') }}</p>
                                <div class="size-10 rounded-md bg-brand-turquoise/10 group-hover:bg-brand-turquoise flex items-center justify-center transition-colors">
                                    <ServicesIcon :icon="item.icon" :alt="item.title" class="size-5 text-brand-turquoise group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 class="font-display text-secondary text-lg font-bold mt-4">{{ item.title }}</h3>
                            <p class="text-brand-turquoise/80 text-sm leading-relaxed mt-2">{{ item.body }}</p>
                            <div v-if="item.tags" class="flex flex-wrap gap-2 mt-4">
                                <span v-for="tag in item.tags" :key="tag" class="text-[11px] uppercase tracking-wider px-2 py-1 rounded border border-brand-turquoise/20 bg-brand-turquoise/5 text-brand-turquoise">{{ tag }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'lifecycle'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
                        <div
                            v-for="step in section.steps"
                            :key="step.label"
                            class="group bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-4 text-center hover:bg-brand-turquoise/10 hover:border-brand-turquoise/40 transition-colors"
                        >
                            <div class="size-10 rounded-full bg-brand-turquoise/10 group-hover:bg-brand-turquoise mx-auto flex items-center justify-center transition-colors">
                                <ServicesIcon :icon="step.icon" :alt="step.label" class="size-4 text-brand-turquoise group-hover:text-white transition-colors" />
                            </div>
                            <p class="text-secondary text-sm font-semibold mt-3">{{ step.label }}</p>
                            <p class="text-brand-turquoise text-xs mt-1">{{ step.desc }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'phases'" class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <div
                            v-for="phase in section.items"
                            :key="phase.num"
                            class="group bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-6 hover:bg-brand-turquoise/10 hover:border-brand-turquoise/40 transition-colors"
                        >
                            <p class="text-brand-turquoise/40 group-hover:text-brand-turquoise text-3xl font-bold italic transition-colors">{{ phase.num }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-2">{{ phase.title }}</h3>
                            <p class="text-brand-turquoise text-sm leading-relaxed mt-3">{{ phase.body }}</p>
                            <ul class="flex flex-col gap-1.5 mt-4">
                                <li v-for="b in phase.items" :key="b" class="text-brand-turquoise/80 text-sm flex gap-2">
                                    <span class="text-brand-turquoise">—</span>
                                    {{ b }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'deliverables'" class="bg-white border border-brand-turquoise/20 rounded-lg overflow-hidden mt-8">
                        <div class="hidden md:grid grid-cols-[2fr_3fr_1fr_1.2fr] bg-brand-turquoise/8 text-brand-turquoise text-xs uppercase tracking-wider font-semibold">
                            <div class="px-4 py-3">{{ t('service_detail_doc_header') }}</div>
                            <div class="px-4 py-3">{{ t('service_detail_desc_header') }}</div>
                            <div class="px-4 py-3">{{ t('service_detail_phase_header') }}</div>
                            <div class="px-4 py-3">{{ t('service_detail_freq_header') }}</div>
                        </div>
                        <div
                            v-for="row in section.rows"
                            :key="row.doc"
                            class="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_1.2fr] border-t border-brand-turquoise/15 hover:bg-brand-turquoise/5 transition-colors"
                        >
                            <div class="px-4 py-3 text-secondary text-sm font-semibold">{{ row.doc }}</div>
                            <div class="px-4 py-3 text-brand-turquoise text-sm">{{ row.desc }}</div>
                            <div class="px-4 py-3 text-brand-turquoise text-xs uppercase tracking-wider">{{ row.phase }}</div>
                            <div class="px-4 py-3 text-brand-turquoise text-sm">{{ row.frequency }}</div>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'standards'" class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <div
                            v-for="item in section.items"
                            :key="item.title"
                            class="group bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-6 hover:bg-brand-turquoise/10 hover:border-brand-turquoise/40 transition-colors"
                        >
                            <p class="text-brand-turquoise text-xs uppercase tracking-wider font-medium">{{ item.label }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-2">{{ item.title }}</h3>
                            <p class="text-brand-turquoise text-sm leading-relaxed mt-3">{{ item.body }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'process'" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div
                            v-for="item in section.items"
                            :key="item.phase"
                            class="border-s-2 border-brand-turquoise/40 ps-5 hover:border-brand-turquoise transition-colors"
                        >
                            <p class="text-brand-turquoise text-xs uppercase tracking-wider font-medium italic">{{ item.phase }}</p>
                            <h3 class="font-display text-secondary text-lg font-bold mt-1">{{ item.title }}</h3>
                            <p class="text-brand-turquoise text-sm leading-relaxed mt-2">{{ item.body }}</p>
                        </div>
                    </div>

                    <div v-else-if="section.type === 'timeline'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-8 border border-brand-turquoise/20 rounded-lg overflow-hidden bg-white">
                        <div
                            v-for="(item, idx) in section.items"
                            :key="item.num"
                            :class="['group p-6 hover:bg-brand-turquoise/8 transition-colors', idx < section.items.length - 1 ? 'lg:border-e border-brand-turquoise/15' : '', idx < section.items.length - 1 ? 'border-b lg:border-b-0' : '']"
                        >
                            <p class="text-brand-turquoise/40 group-hover:text-brand-turquoise text-3xl font-bold italic transition-colors">{{ item.num }}</p>
                            <h3 class="font-display text-secondary text-base font-bold mt-2">{{ item.title }}</h3>
                            <p class="text-brand-turquoise text-sm leading-relaxed mt-2">{{ item.body }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultFadeIn>

        <DefaultFadeIn v-if="service.cta">
            <DefaultCta
                :eyebrow="service.cta.eyebrow"
                :title="service.cta.title"
                :primary-label="t('common_contact_us')"
                :secondary-label="t('service_detail_view_all_btn')"
                :secondary-to="{ name: 'services' }"
            />
        </DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'service-detail' })

const { t } = useT()
const route = useRoute()
const { service, error } = await useService(computed(() => route.params.slug))
requireRecord(service.value, error)

// Canonicalize legacy /services/<id> URLs to the slug URL.
const localePath = useLocalePath()
if (service.value?.slug && String(route.params.slug) !== service.value.slug) {
    await navigateTo(localePath({ name: 'service-detail', params: { slug: service.value.slug } }), { redirectCode: 301, replace: true })
}

const titleParts = computed(() => {
    if (!service.value?.hero?.title) return []
    const title = service.value.hero.title
    const h = service.value.hero.highlight
    if (!h) return [title]
    return title.split(h).flatMap((part, i, arr) => i < arr.length - 1 ? [part.trim(), h] : [part.trim()]).filter(Boolean)
})

useSeoMeta({
    title: computed(() => service.value?.title || t('seo_service_fallback_title', 'Service')),
    description: computed(() => clampMeta(service.value?.desc)),
})
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
