<template>
    <section class="relative bg-secondary py-18 md:py-25 overflow-hidden">
        <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
            <DefaultBreadcrumb
                :items="[
                    { name: t('nav_home', 'Home'), to: { name: 'home' } },
                    { name: t('nav_areas', 'Areas') },
                ]"
                class="text-sm text-white mb-5"
            />
            <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('areas_hero_eyebrow') }}</p>
            <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                {{ t('areas_hero_title') }}
            </h1>
            <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                {{ t('areas_hero_body') }}
            </p>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
