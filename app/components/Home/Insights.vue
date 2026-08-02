<template>
    <section v-if="metrics.length || reports.length" class="bg-white py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex justify-between items-end gap-4">
                <div>
                    <p class="text-brand-turquoise text-sm uppercase tracking-[0.15em] font-medium">
                        {{ t('home_insights_eyebrow') }}
                    </p>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">
                        {{ t('home_insights_title') }}
                    </h2>
                </div>
                <NuxtLinkLocale
                    :to="{ name: 'insights' }"
                    class="shrink-0 inline-flex items-center gap-1 text-brand-turquoise text-sm font-medium hover:gap-2 transition-all"
                >
                    {{ t('common_view_all') }}
                    <LucideChevronRight class="size-4 rtl:rotate-180" />
                </NuxtLinkLocale>
            </div>

            <div v-if="metrics.length" class="mt-8 md:mt-10 bg-brand-turquoise/5 border border-brand-turquoise/15 rounded-xl p-4 md:p-6">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 sm:divide-x rtl:sm:divide-x-reverse divide-brand-turquoise/15">
                    <div
                        v-for="m in metrics"
                        :key="m.label"
                        class="flex items-center justify-between gap-3 px-2 md:px-4"
                    >
                        <div class="size-10 rounded-md bg-brand-turquoise/10 flex items-center justify-center shrink-0">
                            <ServicesIcon :icon="m.icon" :alt="m.label" class="size-4 text-brand-turquoise" />
                        </div>
                        <div class="text-end">
                            <p class="text-brand-turquoise text-xs">{{ m.label }}</p>
                            <p class="text-secondary text-base md:text-lg font-bold mt-0.5">{{ m.value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="reports.length" class="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <NuxtLinkLocale
                    v-for="report in reports"
                    :key="report.id"
                    :to="report.to"
                    class="group bg-white rounded-lg border border-brand-turquoise/15 p-6 hover:border-brand-turquoise/40 hover:bg-brand-turquoise/5 transition-colors cursor-pointer h-full block"
                >
                    <div class="flex items-start justify-between">
                        <span class="text-[11px] text-brand-turquoise uppercase tracking-wider border border-brand-turquoise/30 rounded-md px-2 py-0.5">{{ report.tag }}</span>
                        <div class="size-9 rounded-md bg-brand-turquoise/10 group-hover:bg-brand-turquoise flex items-center justify-center transition-colors">
                            <component :is="report.icon" class="size-4 text-brand-turquoise group-hover:text-white transition-colors" />
                        </div>
                    </div>
                    <h3 class="font-display text-base mt-4 mb-2 text-secondary font-bold group-hover:text-brand-turquoise transition-colors">
                        {{ report.title }}
                    </h3>
                    <p class="text-brand-turquoise/80 text-sm leading-relaxed mb-5">
                        {{ report.description }}
                    </p>
                    <div class="flex items-center justify-between border-t border-brand-turquoise/15 pt-4">
                        <span class="text-xs text-brand-turquoise/70 inline-flex items-center gap-1.5">
                            <LucideCalendar class="size-3.5" />
                            {{ report.date }}
                        </span>
                        <span class="text-brand-turquoise text-sm inline-flex items-center gap-1 group-hover:underline transition-all font-medium">
                            {{ t('common_read_more') }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </span>
                    </div>
                </NuxtLinkLocale>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { LucideFileText, LucideTrendingUp, LucideBarChart3 } from 'lucide-vue-next'

const { t } = useT()
const { home } = useHome()
const posts = useInsights()
const fmtDate = useInsightDate()

const metrics = computed(() =>
    (home.value.market_metrics ?? []).map(m => ({ icon: m.icon || '', label: m.label || '', value: m.value || '' }))
)

const cardIcons = [LucideBarChart3, LucideTrendingUp, LucideFileText]

const reports = computed(() => posts.value.slice(0, 3).map((p, i) => ({
    id: p.id,
    tag: p.category,
    title: p.title,
    description: p.excerpt,
    date: fmtDate(p.date),
    icon: cardIcons[i % cardIcons.length],
    to: { name: 'insight-detail', params: { slug: p.slug } },
})))
</script>

<style scoped></style>
