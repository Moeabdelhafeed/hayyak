<template>
    <section class="relative bg-secondary text-white overflow-hidden">
        <div class="absolute inset-0 opacity-10" :style="{ backgroundImage: 'radial-gradient(circle at 20% 30%, var(--brand-turquoise) 0%, transparent 50%)' }" />
        <div class="relative px-4 max-w-[1350px] mx-auto py-16 md:py-24">
            <DefaultBreadcrumb
                :items="[
                    { name: t('nav_home', 'Home'), to: { name: 'home' } },
                    { name: t('nav_careers', 'Careers') },
                ]"
                class="text-sm text-white mb-6"
            />
            <p class="text-brand-turquoise font-semibold text-sm uppercase tracking-[0.2em]">{{ t('careers_hero_eyebrow') }}</p>
            <h1 class="font-display text-3xl md:text-5xl font-bold mt-3 max-w-3xl">{{ t('careers_hero_title') }}</h1>
            <p class="text-white/70 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">{{ t('careers_hero_subtitle') }}</p>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
