<template>
    <div v-if="post">
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: sectionLabel, to: sectionTo },
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
                <!-- The main document stays the hero's one call to action however many
                     files are attached; the rest live in the Documents block below, so a
                     ten-file report does not push the article off the screen. -->
                <div v-if="post.pdfs.length" class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6">
                    <a
                        :href="post.pdfs[0].url"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-2 bg-brand-cyan-neon text-secondary rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-cyan-neon/90 transition-colors"
                    >
                        <LucideDownload class="size-4" />
                        {{ t('insights_download_pdf', 'Download PDF') }}
                        <span v-if="post.pdfs[0].size" class="text-secondary/60 text-xs">{{ fmtBytes(post.pdfs[0].size) }}</span>
                    </a>
                    <a
                        v-if="post.pdfs.length > 1"
                        href="#documents"
                        class="text-white/70 text-sm hover:text-white underline underline-offset-4 decoration-white/30"
                    >
                        {{ fillPattern(t('insights_documents_more', '+{count} more documents'), { count: post.pdfs.length - 1 }) }}
                    </a>
                </div>
            </div>
        </section>

        <div v-if="post.image" class="max-w-[1350px] mx-auto px-4 mt-8 md:mt-10">
            <NuxtImg format="webp"
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

                <!-- Everything the editor attached in the CMS, below the copy: files
                     first because they are what a report reader came for. -->
                <section v-if="post.pdfs.length" id="documents" class="max-w-3xl mt-12 scroll-mt-28">
                    <h2 class="font-display text-secondary text-lg font-bold">
                        {{ t('insights_documents', 'Documents') }}
                    </h2>
                    <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <li v-for="f in post.pdfs" :key="f.title + f.url">
                            <a
                                :href="f.url"
                                target="_blank"
                                rel="noopener"
                                class="group border-brand-turquoise/15 hover:border-brand-turquoise/40 flex items-center gap-3 rounded-lg border bg-white p-3.5 transition-all hover:shadow-md"
                            >
                                <span class="bg-brand-turquoise/8 text-brand-turquoise flex size-10 shrink-0 items-center justify-center rounded-md">
                                    <LucideFileText class="size-5" />
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span dir="auto" class="text-secondary group-hover:text-brand-turquoise block truncate text-sm font-semibold transition-colors">
                                        {{ f.title }}
                                    </span>
                                    <span class="text-brand-turquoise/70 mt-0.5 block text-xs">
                                        PDF<template v-if="f.size"> · {{ fmtBytes(f.size) }}</template>
                                    </span>
                                </span>
                                <LucideDownload class="text-brand-turquoise/50 group-hover:text-brand-turquoise size-4 shrink-0 transition-colors" />
                            </a>
                        </li>
                    </ul>
                </section>

                <!-- External by definition, so a new tab + noopener noreferrer. The host
                     is shown so a reader can see where a link goes before clicking. -->
                <section v-if="post.links.length" class="max-w-3xl mt-10">
                    <h2 class="font-display text-secondary text-lg font-bold">
                        {{ t('insights_links', 'Related links') }}
                    </h2>
                    <ul class="border-brand-turquoise/15 mt-3 divide-y divide-brand-turquoise/10 border-y">
                        <li v-for="l in post.links" :key="l.url">
                            <a
                                :href="l.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group flex items-center gap-3 py-3 transition-colors"
                            >
                                <LucideExternalLink class="text-brand-turquoise/50 group-hover:text-brand-turquoise size-4 shrink-0 transition-colors" />
                                <span class="min-w-0 flex-1">
                                    <span dir="auto" class="text-secondary group-hover:text-brand-turquoise block text-sm font-medium transition-colors">
                                        {{ l.label }}
                                    </span>
                                    <span v-if="hostOf(l.url)" class="text-brand-turquoise/60 block text-xs">{{ hostOf(l.url) }}</span>
                                </span>
                                <LucideArrowUpRight class="text-brand-turquoise/40 group-hover:text-brand-turquoise size-4 shrink-0 transition-all group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </section>

        <DefaultFadeIn>
            <DefaultCta
                :title="t('insights_cta_title')"
                :primary-label="t('common_contact_us')"
                :secondary-label="backLabel"
                :secondary-to="sectionTo"
            />
        </DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'insight-detail' })

const { t } = useT()
const route = useRoute()
const site = useSiteConfig()
const { post, error } = await useInsight(computed(() => route.params.slug))
requireRecord(post.value, error)
const fmtDate = useInsightDate()

// Canonicalize legacy /insights/<id> URLs to the slug URL.
const localePath = useLocalePath()
if (post.value?.slug && String(route.params.slug) !== post.value.slug) {
    await navigateTo(localePath({ name: 'insight-detail', params: { slug: post.value.slug } }), { redirectCode: 301, replace: true })
}

// Which section this post belongs to, via its category — there is no hub page to fall
// back on, so the breadcrumb and the "back" CTA have to resolve to Research or Blog.
const { categories } = useBlogCategories()
const section = computed(
    () => categories.value.find((c) => c.slug === post.value?.categorySlug)?.section || 'research',
)
const sectionTo = computed(() => ({ name: section.value === 'blog' ? 'blog' : 'research' }))
const sectionLabel = computed(() =>
    section.value === 'blog' ? t('nav_blog') : t('nav_research'),
)

const backLabel = computed(() =>
    fillPattern(t('insights_back_to_section', 'Back to {name}'), { name: sectionLabel.value }),
)

const isHtml = computed(() => /<\/?[a-z][\s\S]*>/i.test(post.value?.body || ''))
const paragraphs = computed(() =>
    String(post.value?.body || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
)

useSeoMeta({
    // EN post titles are short internal labels ("ARPI Pulse Q1/2026"); the Arabic ones
    // are already descriptive, so the AR pattern is just "{title}".
    title: computed(() => post.value?.metaTitle
        || fillPattern(t('seo_insight_title', '{title}: Jordan Real Estate Market Report'),
            { title: post.value?.title ?? '' })
        || post.value?.title
        || t('seo_insight_fallback_title', 'Insight')),
    // Every post carries the same excerpt ("Amman residential market analysis", 33 chars),
    // so the raw field gave all three posts one identical, too-short description.
    description: computed(() => post.value?.metaDescription
        ? clampMeta(post.value.metaDescription, 160)
        : clampMeta(fillPattern(t('seo_insight_description', '{title}: {excerpt} from Hayyak — sale prices, rents, demand and what the quarter means for owners and investors in Jordan.'), {
        title: post.value?.title ?? '',
        excerpt: post.value?.excerpt ?? '',
    }) || post.value?.excerpt, 160)),
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
        // CMS has no per-post author — the brand is the author. `url` is what lets Google
        // tie the author entity to the publisher rather than treating it as an unknown
        // organisation that happens to share a name.
        author: () => ({ '@type': 'Organization', name: site.name, url: site.url }),
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
