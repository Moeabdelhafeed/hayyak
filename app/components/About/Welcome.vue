<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_welcome_eyebrow') }}</p>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('about_welcome_title') }}</h2>
                    <p class="text-primary/80 leading-relaxed mt-6">
                        {{ t('about_welcome_p1') }}
                    </p>
                    <p class="text-primary/80 leading-relaxed mt-4">
                        {{ t('about_welcome_p2') }}
                    </p>
                    <div class="bg-primary/5 border-s-4 border-primary p-5 rounded-e-md mt-6">
                        <LucideQuote class="size-5 text-primary/40 mb-2" />
                        <p class="text-primary italic">{{ t('about_welcome_quote') }}</p>
                    </div>
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1604510819628-539c92c78658?auto=format&fit=crop&w=1200&q=80"
                        alt="Hayyak team"
                        class="rounded-lg w-full h-[420px] object-cover"
                    >
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
