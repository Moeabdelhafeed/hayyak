<template>
    <section class="bg-secondary text-white">
        <div class="max-w-[1350px] mx-auto px-4 py-10 md:py-14">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.2em] font-medium">
                        {{ eyebrow || t('default_cta_eyebrow') }}
                    </p>
                    <h2 class="font-display text-2xl md:text-3xl font-bold mt-3">
                        {{ title || t('default_cta_title') }}
                    </h2>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink
                        :to="primaryTo"
                        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,107,38,0.55)] transition-all text-sm font-medium"
                    >
                        <LucideKey class="size-4" />
                        {{ primaryLabel || t('default_cta_book_consultation') }}
                    </NuxtLink>
                    <NuxtLink
                        :to="secondaryTo"
                        class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-cyan-neon/40 text-white rounded-md hover:bg-brand-cyan-neon/10 hover:border-brand-cyan-neon hover:shadow-[0_0_14px_rgba(85,255,255,0.4)] transition-all text-sm font-medium"
                    >
                        <LucideHome class="size-4" />
                        {{ secondaryLabel || t('default_cta_list_property') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, default: '' },
    primaryLabel: { type: String, default: '' },
    primaryTo: { type: [String, Object], default: () => ({ name: 'contact' }) },
    secondaryLabel: { type: String, default: '' },
    secondaryTo: { type: [String, Object], default: () => ({ name: 'contact' }) },
})
</script>
