<template>
    <section class="bg-brand-orange text-white">
        <div class="max-w-[1350px] mx-auto px-4 py-12 md:py-16">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="font-display text-2xl md:text-3xl font-bold">{{ t('areas_cta_title') }}</h2>
                    <p class="text-white/85 mt-3 text-sm md:text-base">
                        {{ t('areas_cta_body') }}
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0">
                    <NuxtLinkLocale
                        :to="{ name: 'contact' }"
                        class="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-brand-orange rounded-md hover:bg-white/90 transition-all text-sm md:text-base font-medium"
                    >
                        {{ t('common_contact_us') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                    <NuxtLinkLocale
                        :to="{ name: 'properties' }"
                        class="inline-flex items-center justify-center gap-2 px-7 py-3 border border-white/70 text-white rounded-md hover:bg-white/10 hover:border-white transition-all text-sm md:text-base font-medium"
                    >
                        {{ t('nav_properties') }}
                    </NuxtLinkLocale>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
