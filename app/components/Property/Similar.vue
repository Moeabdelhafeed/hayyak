<template>
    <section class="py-12 md:py-16 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex items-end justify-between gap-4">
                <div>
                    <p class="text-primary text-xs uppercase tracking-[0.15em] font-medium">You may also like</p>
                    <h2 class="font-display text-secondary text-xl md:text-2xl font-bold mt-2">Similar Properties</h2>
                </div>
                <NuxtLink
                    :to="{ name: 'properties' }"
                    class="hidden sm:inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                    View More
                    <LucideChevronRight class="size-4 rtl:rotate-180" />
                </NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                <NuxtLink
                    v-for="p in items"
                    :key="p.id"
                    :to="{ name: 'property-detail', params: { id: p.id } }"
                >
                    <CardsProperty
                        :image="p.image"
                        :tag="p.tag"
                        :tag-variant="p.tagVariant"
                        :type="p.type"
                        :location="p.location"
                        :title="p.title"
                        :bedrooms="p.bedrooms"
                        :bathrooms="p.bathrooms"
                        :area="p.area"
                        :price="p.price"
                        class="h-95"
                    />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    items: { type: Array, required: true },
})
</script>
