<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto text-center">
            <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_coverage_eyebrow') }}</p>
            <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('about_coverage_title') }}</h2>
            <p class="text-primary/80 max-w-2xl mx-auto leading-relaxed mt-5">
                {{ t('about_coverage_body') }}
            </p>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
