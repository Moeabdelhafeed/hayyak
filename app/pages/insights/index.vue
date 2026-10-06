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

        <!-- Categories. Only those with posts: an empty category card is a dead end,
             and two of the three have no posts today. -->
        <section v-if="categories.length" class="py-12 md:py-16 bg-white">
            <div class="px-4 max-w-[1350px] mx-auto">
                <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">
                    {{ t('insights_categories_title', 'Browse by category') }}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-6">
                    <NuxtLinkLocale
                        v-for="c in categories"
                        :key="c.id"
                        :to="{ name: 'insight-category', params: { slug: c.slug } }"
                        class="group relative rounded-lg border border-brand-turquoise/15 overflow-hidden hover:border-brand-turquoise/40 hover:shadow-md transition-all h-40 flex items-end"
                    >
                        <!-- `cover_image` is null on every category right now, so the
                             colour the CMS already stores carries the card until one
                             is uploaded. -->
                        <NuxtImg
                            v-if="c.image"
                            format="webp"
                            :src="c.image"
                            :alt="c.name"
                            loading="lazy"
                            decoding="async"
                            sizes="sm:100vw md:50vw lg:33vw"
                            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div
                            class="absolute inset-0"
                            :style="c.image
                                ? { background: 'linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.15))' }
                                : { backgroundColor: c.color || 'var(--brand-turquoise)' }"
                        ></div>
                        <div class="relative p-5 w-full">
                            <h3 dir="auto" class="font-display text-white text-lg font-bold">{{ c.name }}</h3>
                            <p v-if="c.description" dir="auto" class="text-white/70 text-xs mt-1 line-clamp-2">{{ c.description }}</p>
                            <span class="text-white/80 text-xs mt-1 inline-block">
                                {{ c.count }} {{ t('insights_posts_count', 'articles') }}
                            </span>
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
