<template>
    <section class="py-12 md:py-20 bg-primary">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="font-display text-2xl md:text-3xl text-white font-bold">{{ t('services_cta_title') }}</h2>
                    <p class="text-white/70 mt-3">
                        {{ t('services_cta_body') }}
                    </p>
                </div>
                <NuxtLink
                    :to="{ name: 'contact' }"
                    class="inline-flex items-center gap-2 px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,107,38,0.55)] transition-all text-sm md:text-base"
                >
                    {{ t('common_contact_us') }}
                    <LucideArrowRight class="size-4 rtl:rotate-180" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
</script>
