<template>
    <section class="py-12 md:py-16 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex items-end justify-between gap-4">
                <div>
                    <p class="text-primary text-xs uppercase tracking-[0.15em] font-medium">{{ t('property_similar_eyebrow') }}</p>
                    <h2 class="font-display text-secondary text-xl md:text-2xl font-bold mt-2">{{ t('property_similar_title') }}</h2>
                </div>
                <NuxtLinkLocale
                    :to="{ name: 'properties' }"
                    class="hidden sm:inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                    {{ t('property_similar_view_more') }}
                    <LucideChevronRight class="size-4 rtl:rotate-180" />
                </NuxtLinkLocale>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                <NuxtLinkLocale
                    v-for="p in items"
                    :key="p.id"
                    :to="{ name: 'property-detail', params: { id: p.id } }"
                >
                    <CardsProperty
                        :image="p.image"
                        :tag="p.tag"
                        :tag-variant="p.tagVariant"
                        :tags="p.tags"
                        :status-label="p.statusLabel"
                        :type="p.type"
                        :location="p.location"
                        :title="p.title"
                        :building="p.building"
                        :bedrooms="p.bedrooms"
                        :bathrooms="p.bathrooms"
                        :area="p.area"
                        :parking="p.parking"
                        :currency="p.currency"
                        :price="p.price"
                        :price-period="p.pricePeriod"
                        class="h-95"
                    />
                </NuxtLinkLocale>
            </div>
        </div>
    </section>
</template>

<script setup>
const { t } = useT()
defineProps({
    items: { type: Array, required: true },
})
</script>
