<template>
    <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
        <div class="absolute inset-0 opacity-15">
            <img
                src="https://images.unsplash.com/photo-1553601581-8a1f1010efbe?auto=format&fit=crop&w=1600&q=80"
                alt=""
                class="w-full h-full object-cover"
            >
        </div>
        <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
            <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('services_hero_eyebrow') }}</p>
            <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                {{ t('services_hero_title') }}
            </h1>
            <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                {{ t('services_hero_body') }}
            </p>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
