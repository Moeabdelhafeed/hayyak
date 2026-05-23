<template>
    <section class="bg-white py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex justify-between items-end">
                <div>
                    <p class="text-primary/80 text-sm uppercase">
                        {{ t('home_insights_eyebrow') }}
                    </p>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">
                        {{ t('home_insights_title') }}
                    </h2>
                </div>
            </div>

            <div class="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <NuxtLink
                    v-for="report in reports"
                    :key="report.title"
                    :to="report.to"
                    class="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow group cursor-pointer h-full block"
                >
                    <span class="text-xs text-primary uppercase tracking-wider">{{ report.tag }}</span>
                    <h3 class="font-display text-base mt-2 mb-2 text-secondary font-medium group-hover:text-primary transition-colors">
                        {{ report.title }}
                    </h3>
                    <p class="text-muted-foreground text-sm leading-relaxed mb-4">
                        {{ report.description }}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">{{ report.date }}</span>
                        <span class="text-brand-cyan text-sm flex items-center gap-1 group-hover:underline group-hover:drop-shadow-[0_0_6px_rgba(0,193,192,0.5)] transition-all">
                            {{ t('common_read_more') }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()

const reports = computed(() => [
    {
        tag: t('home_insights_post_1_tag'),
        title: t('home_insights_post_1_title'),
        description: t('home_insights_post_1_body'),
        date: t('home_insights_post_1_date'),
        to: '/',
    },
    {
        tag: t('home_insights_post_2_tag'),
        title: t('home_insights_post_2_title'),
        description: t('home_insights_post_2_body'),
        date: t('home_insights_post_2_date'),
        to: '/',
    },
    {
        tag: t('home_insights_post_3_tag'),
        title: t('home_insights_post_3_title'),
        description: t('home_insights_post_3_body'),
        date: t('home_insights_post_3_date'),
        to: '/',
    },
])
</script>

<style scoped></style>
