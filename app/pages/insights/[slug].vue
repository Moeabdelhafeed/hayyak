<template>
    <div v-if="post">
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: t('nav_insights', 'Insights'), to: { name: 'insights' } },
                        { name: post.title },
                    ]"
                    class="text-sm text-white/60"
                />

                <div class="flex items-center gap-3 text-sm text-white/60 mt-6">
                    <span v-if="post.category" class="text-[11px] text-white uppercase tracking-wider bg-brand-turquoise/90 rounded-md px-2 py-0.5">{{ post.category }}</span>
                    <span v-if="post.date" class="inline-flex items-center gap-1.5">
                        <LucideCalendar class="size-3.5" />
                        {{ fmtDate(post.date) }}
                    </span>
                </div>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-3xl">{{ post.title }}</h1>
                <p v-if="post.excerpt && post.excerpt !== post.body" class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ post.excerpt }}
                </p>
                <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-5">
                    <span v-for="tg in post.tags" :key="tg" class="text-xs text-white/80 bg-white/10 rounded-md px-2 py-1">#{{ tg }}</span>
                </div>
                <a
                    v-if="post.pdf"
                    :href="post.pdf"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 mt-6 bg-brand-cyan-neon text-secondary rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-cyan-neon/90 transition-colors"
                >
                    <LucideFileText class="size-4" />
                    {{ t('insights_download_pdf', 'Download PDF') }}
                </a>
            </div>
        </section>

        <div v-if="post.image" class="max-w-[1350px] mx-auto px-4 mt-8 md:mt-10">
            <NuxtImg
                :src="post.image"
                :alt="post.title"
                sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
                loading="eager"
                fetchpriority="high"
                class="w-full h-[40vh] sm:h-[55vh] md:h-[65vh] object-cover rounded-2xl"
            />
        </div>

        <section class="pt-8 md:pt-12 pb-12 md:pb-20 bg-white">
            <div class="max-w-[1350px] mx-auto px-4">
                <article class="max-w-3xl">
                    <div v-if="isHtml" class="prose-insight" v-html="post.body"></div>
                    <p
                        v-for="(p, i) in paragraphs"
                        v-else
                        :key="i"
                        class="text-primary/85 leading-relaxed mb-4 text-[15px]"
                    >
                        {{ p }}
                    </p>
                </article>
            </div>
        </section>

        <DefaultFadeIn>
            <DefaultCta
                :title="t('insights_cta_title')"
                :primary-label="t('common_contact_us')"
                :secondary-label="t('insights_back')"
                :secondary-to="{ name: 'insights' }"
            />
        </DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'insight-detail' })

const { t } = useT()
const route = useRoute()
const { post, error } = await useInsight(computed(() => route.params.slug))
requireRecord(post.value, error)
const fmtDate = useInsightDate()

// Canonicalize legacy /insights/<id> URLs to the slug URL.
const localePath = useLocalePath()
if (post.value?.slug && String(route.params.slug) !== post.value.slug) {
    await navigateTo(localePath({ name: 'insight-detail', params: { slug: post.value.slug } }), { redirectCode: 301, replace: true })
}

const isHtml = computed(() => /<\/?[a-z][\s\S]*>/i.test(post.value?.body || ''))
const paragraphs = computed(() =>
    String(post.value?.body || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
)

useSeoMeta({
    title: computed(() => post.value?.title || t('seo_insight_fallback_title', 'Insight')),
    description: computed(() => clampMeta(post.value?.excerpt)),
    ogType: 'article',
    ogImage: computed(() => post.value?.image || undefined),
})

useSchemaOrg([
    defineArticle({
        // BlogPosting rather than bare Article — these are blog/insight posts, and it
        // is the type Google documents for this content.
        '@type': 'BlogPosting',
        headline: () => post.value?.title || undefined,
        description: () => post.value?.excerpt || undefined,
        image: () => post.value?.image || undefined,
        datePublished: () => post.value?.date || undefined,
        // Freshness signal — falls back to the publish date when the CMS has no edit date.
        dateModified: () => post.value?.updated || post.value?.date || undefined,
        // CMS has no per-post author — the brand is the author.
        author: { '@type': 'Organization', name: 'Hayyak' },
    }),
])
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
.prose-insight :deep(h2) { font-weight: 700; font-size: 1.4rem; margin: 1.5rem 0 0.75rem; color: #1E4A7C; }
.prose-insight :deep(h3) { font-weight: 700; font-size: 1.15rem; margin: 1.25rem 0 0.5rem; }
.prose-insight :deep(p) { line-height: 1.75; margin-bottom: 1rem; color: rgba(0,0,0,0.82); font-size: 15px; }
.prose-insight :deep(ul) { list-style: disc; padding-inline-start: 1.25rem; margin-bottom: 1rem; }
.prose-insight :deep(li) { margin-bottom: 0.35rem; }
.prose-insight :deep(a) { color: #006A72; text-decoration: underline; }
.prose-insight :deep(img) { border-radius: 0.5rem; margin: 1rem 0; }
</style>
