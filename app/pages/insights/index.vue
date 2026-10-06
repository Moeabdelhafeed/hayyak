<template>
    <div>
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-16">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: t('nav_insights', 'Insights') },
                    ]"
                    class="text-sm text-white mb-5"
                />
                <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('home_insights_eyebrow') }}</p>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                    {{ t('home_insights_title') }}
                </h1>
                <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ t('insights_intro') }}
                </p>
            </div>
        </section>

        <!-- Categories. There is no image field for a category in the CMS, so these are
             built from what a category actually has: its name, its colour and its count.
             Same dark card + cyan-neon underline as the area cards, so they read as part
             of the same site rather than as image cards with the image missing.
             Only categories with posts — an empty card is a dead end. -->
        <section v-if="categories.length" class="py-12 md:py-16 bg-white">
            <div class="px-4 max-w-[1350px] mx-auto">
                <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">
                    {{ t('insights_categories_title', 'Browse by category') }}
                </h2>
                <!-- auto-fit, not fixed columns: only one category has posts today, and a
                     lone card in a 3-column grid leaves two thirds of the row empty. This
                     fills the row at any count and tightens to 3-up as more fill in. -->
                <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 md:gap-5 mt-6">
                    <NuxtLinkLocale
                        v-for="c in categories"
                        :key="c.id"
                        :to="{ name: 'insight-category', params: { slug: c.slug } }"
                        class="group relative overflow-hidden rounded-lg bg-secondary p-6 min-h-[172px] flex flex-col justify-end"
                    >
                        <!-- The CMS colour, used as the card's identity instead of a photo. -->
                        <span
                            class="absolute inset-y-0 start-0 w-1 transition-all duration-500 group-hover:w-1.5"
                            :style="{ backgroundColor: c.color || 'var(--brand-cyan-neon)' }"
                        ></span>
                        <span
                            class="absolute -top-16 -end-16 size-48 rounded-full blur-2xl opacity-20 transition-all duration-700 group-hover:opacity-35 group-hover:scale-110"
                            :style="{ backgroundColor: c.color || 'var(--brand-turquoise)' }"
                        ></span>
                        <LucideNewspaper
                            class="absolute top-5 end-5 size-10 text-white/10 transition-all duration-500 group-hover:text-white/20 group-hover:scale-110"
                        />

                        <div class="relative">
                            <p
                                dir="auto"
                                class="font-display text-white text-2xl underline decoration-2 underline-offset-8"
                                :style="{ textDecorationColor: c.color || 'var(--brand-cyan-neon)' }"
                            >{{ c.name }}</p>
                            <p v-if="c.description" dir="auto" class="text-white/55 text-sm mt-3 line-clamp-2">
                                {{ c.description }}
                            </p>
                            <div class="flex items-center justify-between mt-4">
                                <span class="text-white/60 text-sm">
                                    {{ c.count }} {{ t('insights_posts_count', 'articles') }}
                                </span>
                                <LucideArrowRight
                                    class="size-4 text-white/60 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                                />
                            </div>
                        </div>
                    </NuxtLinkLocale>
                </div>
            </div>
        </section>

        <section class="py-12 md:py-20 bg-white" :class="categories.length ? 'pt-0 md:pt-0' : ''">
            <div class="px-4 max-w-[1350px] mx-auto">
                <h2 v-if="categories.length" class="font-display text-secondary text-xl md:text-2xl font-bold mb-6">
                    {{ t('insights_all_title', 'All articles') }}
                </h2>
                <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    <InsightsCard v-for="post in posts" :key="post.id" :post="post" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
definePageMeta({ name: 'insights' })

const { t } = useT()
const posts = useInsights()
const { categories: allCategories } = useBlogCategories()
// Hide empty categories — clicking one would land on a page with nothing on it.
const categories = computed(() => allCategories.value.filter((c) => c.count > 0))

useSeoMeta({
    title: () => t('seo_insights_title'),
    description: () => t('seo_insights_description'),
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
