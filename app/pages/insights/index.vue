<template>
    <div>
        <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative max-w-[1350px] mx-auto px-4 pt-16">
                <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('home_insights_eyebrow') }}</p>
                <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                    {{ t('home_insights_title') }}
                </h1>
                <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                    {{ t('insights_intro') }}
                </p>
            </div>
        </section>

        <section class="py-12 md:py-20 bg-white">
            <div class="px-4 max-w-[1350px] mx-auto">
                <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    <NuxtLink
                        v-for="post in posts"
                        :key="post.id"
                        :to="{ name: 'insight-detail', params: { id: post.id } }"
                        class="group bg-white rounded-lg border border-brand-turquoise/15 overflow-hidden hover:border-brand-turquoise/40 hover:shadow-md transition-all flex flex-col"
                    >
                        <div class="relative h-48 overflow-hidden bg-brand-turquoise/5">
                            <img v-if="post.image" :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                            <span v-if="post.category" class="absolute top-3 start-3 text-[11px] text-white uppercase tracking-wider bg-brand-turquoise/90 rounded-md px-2 py-0.5">{{ post.category }}</span>
                        </div>
                        <div class="p-6 flex flex-col flex-1">
                            <h3 class="font-display text-base text-secondary font-bold group-hover:text-brand-turquoise transition-colors">{{ post.title }}</h3>
                            <p class="text-brand-turquoise/80 text-sm leading-relaxed mt-2 line-clamp-3">{{ post.excerpt }}</p>
                            <div class="flex items-center justify-between border-t border-brand-turquoise/15 pt-4 mt-auto">
                                <span class="text-xs text-brand-turquoise/70 inline-flex items-center gap-1.5">
                                    <LucideCalendar class="size-3.5" />
                                    {{ formatInsightDate(post.date) }}
                                </span>
                                <span class="text-brand-turquoise text-sm inline-flex items-center gap-1 group-hover:underline font-medium">
                                    {{ t('common_read_more') }}
                                    <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
definePageMeta({ name: 'insights' })

const { t } = useT()
const posts = useInsights()

useSeoMeta({
    title: 'Insights & Market Reports - Hayyak',
    description: "Market insights, research, and reports on Jordan's real estate.",
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
