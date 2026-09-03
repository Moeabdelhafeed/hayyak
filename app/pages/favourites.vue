<template>
    <div class="bg-[#f8fafb] min-h-[60vh]">
        <section class="bg-secondary pt-28 pb-12 md:pt-32 md:pb-16">
            <div class="px-4 max-w-[1350px] mx-auto">
                <p class="text-brand-cyan text-xs uppercase tracking-[0.15em] font-medium">
                    {{ t('favourites_eyebrow', 'Saved') }}
                </p>
                <h1 class="font-display text-white text-2xl md:text-3xl font-bold mt-2">
                    {{ t('favourites_title', 'My Favourites') }}
                </h1>
                <p class="text-white/70 text-sm mt-2">
                    {{ count }} {{ t('favourites_count_suffix', 'saved units') }}
                </p>
            </div>
        </section>

        <section class="py-10 md:py-14">
            <div class="px-4 max-w-[1350px] mx-auto">
                <div
                    v-if="!cards.length"
                    class="w-full bg-white border border-brand-turquoise/15 rounded-xl p-12 flex flex-col items-center justify-center text-center gap-3"
                >
                    <div class="size-16 rounded-full bg-brand-turquoise/10 flex items-center justify-center">
                        <LucideHeart class="size-7 text-brand-turquoise" />
                    </div>
                    <p class="text-secondary font-display font-bold text-lg">
                        {{ t('favourites_empty_title', 'No favourites yet') }}
                    </p>
                    <p class="text-brand-turquoise/80 text-sm max-w-md">
                        {{ t('favourites_empty_body', 'Tap the heart on any unit to save it here for later.') }}
                    </p>
                    <NuxtLinkLocale
                        :to="{ name: 'properties' }"
                        class="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                        {{ t('favourites_browse', 'Browse properties') }}
                    </NuxtLinkLocale>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <NuxtLinkLocale
                        v-for="p in cards"
                        :key="p.id"
                        :to="{ name: 'property-detail', params: { slug: p.slug } }"
                        class="block w-full min-w-0"
                    >
                        <CardsProperty
                            :image="p.image"
                            :tag="p.tag"
                            :tag-variant="p.tagVariant"
                            :type="p.type"
                            :tags="p.tags"
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
                            show-view
                            class="h-[400px] w-full"
                        />
                    </NuxtLinkLocale>
                </div>
            </div>
        </section>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideHeart } from 'lucide-vue-next'

definePageMeta({ name: 'favourites' })

const { t } = useT()
const { favourites, count } = useFavourites()
const locale = useCookie('locale', { default: () => 'en' })

// Fetch the full unit for every favourited id. Dead ids are pruned by the
// favourites.global middleware before this runs, but we still guard against nulls.
const { data: units } = await useAsyncData(
    'favourite-units-detail',
    async () => {
        const ids = favourites.value
        if (!ids.length) return []
        const results = await Promise.all(
            ids.map(id => $fetch(`/api/units/${id}`).then(r => r?.data).catch(() => null)),
        )
        return results.filter(Boolean)
    },
    { watch: [favourites, locale] },
)

const transactionTag = (tt) => tt === 'sale' ? t('properties_filter_sale', 'For Sale') : tt === 'rent' ? t('properties_filter_rent', 'For Rent') : ''
const transactionVariant = (tt) => tt === 'sale' ? 'sale' : 'rent'
const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

const localizedLocation = (u) => {
    const ut = (u.translations ?? []).find(tr => tr.lang === locale.value)?.location
    const pt = (u.property?.translations ?? []).find(tr => tr.lang === locale.value)?.location
    return ut || pt || u.property?.area || u.property?.city || u.property?.location || ''
}

const cards = computed(() => (units.value ?? []).map(u => {
    const tagList = (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(x => x.name)
    return {
        id: u.id,
        slug: u.slug ?? String(u.id ?? ''),
        image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
        tag: transactionTag(u.transaction_type),
        tagVariant: transactionVariant(u.transaction_type),
        tags: tagList,
        type: u.unit_type_name || u.unit_type || '',
        location: localizedLocation(u),
        title: u.name,
        building: u.property?.name || '',
        bedrooms: u.bedrooms ?? 0,
        bathrooms: u.bathrooms ?? 0,
        area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
        parking: u.parking ?? 0,
        currency: u.currency || u.property?.price_currency || 'JOD',
        price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
        pricePeriod: u.is_for_rent ? '/mo' : '',
    }
}))

useSeoMeta({
    title: () => `${t('favourites_title', 'My Favourites')}`,
    description: () => t('favourites_empty_body', 'Your saved units.'),
    robots: 'noindex, follow',
})
</script>
