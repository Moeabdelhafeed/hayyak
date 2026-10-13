<template>
    <div>
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-16">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: sectionLabel, to: sectionTo },
                        { name: category.name },
                    ]"
                    class="text-sm text-white mb-5"
                />
                <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">
                    {{ t('home_insights_eyebrow') }}
                </p>
                <h1 dir="auto" class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                    {{ category.name }}
                </h1>
                <p v-if="category.description" dir="auto" class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ category.description }}
                </p>
            </div>
        </section>

        <section class="py-12 md:py-20 bg-white">
            <div class="px-4 max-w-[1350px] mx-auto">
                <NuxtLinkLocale
                    :to="sectionTo"
                    class="text-brand-turquoise text-sm inline-flex items-center gap-1 hover:underline font-medium mb-8"
                >
                    <LucideArrowLeft class="size-3.5 rtl:rotate-180" />
                    {{ backLabel }}
                </NuxtLinkLocale>

                <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    <!-- The page already says which category this is. -->
                    <InsightsCard v-for="post in posts" :key="post.id" :post="post" :show-category="false" />
                </div>
                <p v-else class="text-brand-turquoise/80">{{ t('insights_empty', 'No articles here yet.') }}</p>

                <DefaultPagination v-model:page="page" :last-page="lastPage" />

            </div>
        </section>
    </div>
</template>

<script setup>
definePageMeta({ name: 'insight-category' })

const route = useRoute()
const { t } = useT()

const slug = computed(() => String(route.params.slug || ''))
const router = useRouter()
// Page lives in the URL so a paginated list is linkable and survives a reload.
const page = computed({
    get: () => Math.max(1, Number(route.query.page) || 1),
    set: (v) => {
        const n = Math.max(1, Number(v) || 1)
        router.push({ query: { ...route.query, page: n > 1 ? String(n) : undefined } })
        if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
    },
})

const { posts, lastPage } = useInsights(slug, page)
const { categories, request: categoriesRequest } = useBlogCategories()
// Awaited so the 404 decision below is made against real data, not an empty list.
await categoriesRequest

const category = computed(() => categories.value.find((c) => c.slug === slug.value) || null)

// The category's own section — there is no hub page to go back to.
const sectionTo = computed(() => ({
    name: category.value?.section === 'blog' ? 'blog' : 'research',
}))
const sectionLabel = computed(() =>
    category.value?.section === 'blog' ? t('nav_blog') : t('nav_research'),
)

const backLabel = computed(() =>
    fillPattern(t('insights_back_to_section', 'Back to {name}'), { name: sectionLabel.value }),
)

// A slug that matches no category is a 404, not an empty page with a blank heading —
// otherwise every typo becomes an indexable, contentless URL.
requireRecord(category.value, false)

useSeoMeta({
    title: () =>
        fillPattern(t('seo_insight_category_title', '{name}: Jordan Real Estate Insights'), {
            name: category.value?.name ?? '',
        }) ||
        category.value?.name ||
        t('seo_insights_title'),
    description: () =>
        clampMeta(
            category.value?.description ||
                fillPattern(
                    t(
                        'seo_insight_category_description',
                        '{name} articles from Hayyak — market reports, price data and analysis for owners and investors in Jordan.',
                    ),
                    { name: category.value?.name ?? '' },
                ),
            160,
        ),
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
