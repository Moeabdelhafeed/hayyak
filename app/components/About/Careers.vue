<template>
    <section id="careers" class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto text-center">
            <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_careers_eyebrow') }}</p>
            <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('about_careers_title') }}</h2>
            <p class="text-primary/80 max-w-xl mx-auto text-sm leading-relaxed mt-4">
                {{ t('about_careers_body') }}
            </p>
            <NuxtLink
                :to="{ name: 'contact', query: { tab: 'careers' } }"
                class="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,107,38,0.55)] transition-all text-sm md:text-base"
            >
                {{ t('common_get_in_touch') }}
                <LucideArrowRight class="size-4 rtl:rotate-180" />
            </NuxtLink>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
