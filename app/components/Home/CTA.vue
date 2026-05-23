<template>
    <section class="bg-primary py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="font-display text-2xl md:text-3xl text-white font-bold">
                        {{ t('home_cta_title') }}
                    </h2>
                    <p class="text-white/70 mt-3">
                        {{ t('home_cta_body') }}
                    </p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink
                        :to="{ name: 'contact' }"
                        class="px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,107,38,0.55)] transition-all text-sm md:text-base"
                    >
                        {{ t('home_cta_book_consultation') }}
                    </NuxtLink>
                    <NuxtLink
                        :to="{ name: 'contact' }"
                        class="px-7 py-3 border border-brand-cyan-neon/40 text-white rounded-md hover:bg-brand-cyan-neon/10 hover:border-brand-cyan-neon hover:shadow-[0_0_14px_rgba(85,255,255,0.4)] transition-all text-sm md:text-base"
                    >
                        {{ t('home_cta_list_property') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>

<style scoped></style>
