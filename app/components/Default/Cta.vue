<template>
    <section class="bg-brand-orange text-white">
        <div class="max-w-[1350px] mx-auto px-4 py-12 md:py-16">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="font-display text-2xl md:text-3xl font-bold">
                        {{ title || t('default_cta_title') }}
                    </h2>
                    <p class="text-white/85 mt-3 text-sm md:text-base">
                        {{ body || t('default_cta_eyebrow') }}
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0">
                    <NuxtLinkLocale
                        :to="primaryTo"
                        class="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-brand-orange rounded-md hover:bg-white/90 transition-all text-sm md:text-base font-medium"
                    >
                        {{ primaryLabel || t('default_cta_book_consultation') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                    <NuxtLinkLocale
                        :to="secondaryTo"
                        class="inline-flex items-center justify-center gap-2 px-7 py-3 border border-white/70 text-white rounded-md hover:bg-white/10 hover:border-white transition-all text-sm md:text-base font-medium"
                    >
                        {{ secondaryLabel || t('default_cta_list_property') }}
                    </NuxtLinkLocale>
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
    body: { type: String, default: '' },
    primaryLabel: { type: String, default: '' },
    primaryTo: { type: [String, Object], default: () => ({ name: 'contact' }) },
    secondaryLabel: { type: String, default: '' },
    secondaryTo: { type: [String, Object], default: () => ({ name: 'contact', query: { tab: 'list-property' }, hash: '#enquiry' }) },
})
</script>
