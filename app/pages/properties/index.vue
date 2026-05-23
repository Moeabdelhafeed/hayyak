<template>
    <div>
        <PropertiesHero />
        <DefaultFadeIn>
            <section class="py-12 md:py-20 bg-[#f8fafb]">
                <div class="px-4 max-w-[1350px] mx-auto">
                    <div class="lg:hidden mb-4">
                        <button
                            type="button"
                            class="w-full inline-flex items-center justify-between px-4 py-3 rounded-lg border border-brand-turquoise/30 bg-white text-secondary"
                            @click="showFilters = !showFilters"
                        >
                            <span class="inline-flex items-center gap-2 text-sm font-medium">
                                <LucideFilter class="size-4 text-brand-turquoise" />
                                {{ t('properties_filters_title') }}
                            </span>
                            <LucideChevronDown :class="['size-4 transition-transform', showFilters ? 'rotate-180' : '']" />
                        </button>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
                        <div :class="[showFilters ? 'block' : 'hidden', 'lg:block']">
                            <PropertiesFilters />
                        </div>
                        <PropertiesGrid />
                    </div>
                </div>
            </section>
        </DefaultFadeIn>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ name: 'properties' })

const { t } = useT()
const showFilters = ref(false)

useSeoMeta({
    title: 'Properties - Hayyak',
    description: 'Browse handpicked apartments, villas, and commercial spaces across Jordan.',
})
</script>
