<!-- Category cards + paginated post grid. Shared by /insights (everything), /research
     and /blog (one `section` each) so the three stay identical in behaviour. -->
<template>
    <div>
        <!-- Only worth showing when there is a choice to make: one category means the
             cards are just a second link to the same list. -->
        <section v-if="categories.length > 1" class="py-12 md:py-16 bg-white">
            <div class="px-4 max-w-[1350px] mx-auto">
                <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">
                    {{ t('insights_categories_title', 'Browse by category') }}
                </h2>
                <!-- auto-fit, not fixed columns: fills the row at any count and tightens
                     to 3-up as more categories fill in. -->
                <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 md:gap-5 mt-6">
                    <NuxtLinkLocale
                        v-for="c in categories"
                        :key="c.id"
                        :to="{ name: 'insight-category', params: { slug: c.slug } }"
                        class="group bg-secondary relative isolate flex min-h-[180px] flex-col justify-end overflow-hidden rounded-lg p-6 transition-shadow duration-300 hover:shadow-xl"
                    >
                        <!-- Same grid pattern as the page heroes, so a category card reads
                             as part of the site rather than a coloured rectangle. -->
                        <span class="card-grid pointer-events-none absolute inset-0 -z-10"></span>
                        <!-- The CMS colour as the card's light source instead of its fill:
                             a corner glow plus the top rule. Keeps every card legible
                             whatever colour an editor picks, and still colour-codes it. -->
                        <span
                            class="pointer-events-none absolute -top-16 -z-10 h-44 w-44 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70 end-[-2rem]"
                            :style="{ backgroundColor: c.color || 'var(--brand-cyan-neon)' }"
                        ></span>
                        <span
                            class="pointer-events-none absolute inset-x-0 top-0 h-px"
                            :style="{ backgroundColor: c.color || 'var(--brand-cyan-neon)' }"
                        ></span>

                        <p dir="auto" class="font-display text-2xl text-white">{{ c.name }}</p>
                        <p v-if="c.description" dir="auto" class="mt-2 line-clamp-2 text-sm text-white/55">
                            {{ c.description }}
                        </p>
                        <div class="mt-5 flex items-center justify-between">
                            <span
                                class="inline-flex items-center gap-2 text-xs tracking-wider uppercase"
                                :style="{ color: c.color || 'var(--brand-cyan-neon)' }"
                            >
                                <span class="size-1.5 rounded-full" :style="{ backgroundColor: 'currentColor' }"></span>
                                <!-- ar has richer plural forms than this; two covers the
                                     counts a category realistically shows. -->
                                {{ c.count }}
                                {{ c.count === 1 ? t('insights_post_count_one', 'article') : t('insights_posts_count', 'articles') }}
                            </span>
                            <LucideArrowRight
                                class="size-4 text-white/50 transition-all group-hover:text-white rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                            />
                        </div>
                    </NuxtLinkLocale>
                </div>
            </div>
        </section>

        <section class="py-12 md:py-20 bg-white" :class="categories.length > 1 ? 'pt-0 md:pt-0' : ''">
            <div class="px-4 max-w-[1350px] mx-auto">
                <h2 v-if="categories.length > 1" class="font-display text-secondary text-xl md:text-2xl font-bold mb-6">
                    {{ t('insights_all_title', 'All articles') }}
                </h2>
                <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    <InsightsCard v-for="post in posts" :key="post.id" :post="post" />
                </div>
                <p v-else class="text-brand-turquoise/80">{{ t('insights_empty', 'No articles here yet.') }}</p>

                <DefaultPagination v-model:page="page" :last-page="lastPage" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    // '' = every section (the /insights hub). 'research' | 'blog' for the section pages.
    section: { type: String, default: '' },
})

const { t } = useT()
const route = useRoute()
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

const sectionRef = computed(() => props.section)
const { posts, lastPage } = useInsights(null, page, 9, sectionRef)
const { categories: allCategories } = useBlogCategories(sectionRef)
// Hide empty categories — clicking one would land on a page with nothing on it.
const categories = computed(() => allCategories.value.filter((c) => c.count > 0))
</script>

<style scoped>
/* The hero's grid, at card scale and faded out towards the bottom so the text sits
   on flat navy. */
.card-grid {
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(to bottom, black, transparent 85%);
    -webkit-mask-image: linear-gradient(to bottom, black, transparent 85%);
}
</style>
