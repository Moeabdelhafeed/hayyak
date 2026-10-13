<template>
    <div>
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-16">
                <DefaultBreadcrumb
                    :items="[
                        { name: t('nav_home', 'Home'), to: { name: 'home' } },
                        { name: t('nav_research') },
                    ]"
                    class="text-sm text-white mb-5"
                />
                <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('research_eyebrow') }}</p>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                    {{ t('research_title') }}
                </h1>
                <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ t('research_intro') }}
                </p>
            </div>
        </section>

        <InsightsListing section="research" />
    </div>
</template>

<script setup>
definePageMeta({ name: 'research' })

const { t } = useT()

useSeoMeta({
    title: () => t('seo_research_title'),
    description: () => t('seo_research_description'),
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
