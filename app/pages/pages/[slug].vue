<template>
    <div class="bg-white">
        <section class="relative bg-secondary pt-32 pb-10 md:pt-36 md:pb-12 overflow-hidden">
            <div class="relative max-w-[1350px] mx-auto px-4">
                <DefaultBreadcrumb
                    v-if="page?.title"
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: page.title },
                    ]"
                    class="text-sm text-white/60"
                />
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-4">
                    {{ page?.title }}
                </h1>
            </div>
        </section>

        <section class="py-12 md:py-20">
            <div class="px-4 max-w-[1350px] mx-auto">
                <NuxtImg v-if="page?.image" :src="page.image" :alt="page.title" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw" loading="lazy" class="w-full rounded-lg mb-8" />
                <article
                    v-if="page?.content"
                    class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-secondary prose-p:text-primary/80 prose-a:text-primary"
                    v-html="page.content"
                />
                <p v-else class="text-primary/70">{{ t('page_not_found') }}</p>
            </div>
        </section>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'page-slug' })

const route = useRoute()
const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data: res, error } = await useFetch(`/api/pages/${route.params.slug}`, {
    watch: [locale],
    key: `page-${route.params.slug}`,
})

const page = computed(() => res.value?.data ?? null)

requireRecord(page.value, error)

useSeoMeta({
    title: computed(() => page.value?.title || t('seo_page_fallback_title', 'Page')),
    description: computed(() => clampMeta(page.value?.meta_description || page.value?.excerpt || page.value?.content)),
})
</script>
