<template>
    <div class="bg-[#f8fafb]">
        <PropertyGallery
            :images="property.images"
            :title="property.title"
            :unit-id="property.id"
        />

        <section class="py-8 md:py-10">
            <div class="px-4 max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                <div class="flex flex-col gap-8">
                    <DefaultFadeIn><PropertyHeader :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyStats :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyDetails :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyAbout :description="property.description" :description-html="property.descriptionHtml" /></DefaultFadeIn>
                    <DefaultFadeIn v-if="property.features.length"><PropertyFeatures :features="property.features" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyMap :lat="property.lat" :lng="property.lng" :title="property.title" /></DefaultFadeIn>
                </div>

                <DefaultFadeIn><PropertySidebar :property="property" /></DefaultFadeIn>
            </div>
        </section>

        <DefaultFadeIn><PropertySimilar :items="similar" /></DefaultFadeIn>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ name: 'property-detail' })

const route = useRoute()
const locale = useCookie('locale', { default: () => 'en' })

const { data: res } = await useFetch(`/api/units/${route.params.id}`, {
    watch: [locale],
    key: `unit-${route.params.id}`,
})

const transactionLabel = (t) => t === 'sale' ? 'For Sale' : t === 'rent' ? 'For Rent' : ''
const transactionVariant = (t) => t === 'sale' ? 'sale' : 'rent'

const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

// Location is now translated per-locale in unit/property translations[].location.
// Prefer the matched-locale translation, fall back to property fields.
const localizedLocation = (u) => {
    const ut = (u.translations ?? []).find(tr => tr.lang === locale.value)?.location
    const pt = (u.property?.translations ?? []).find(tr => tr.lang === locale.value)?.location
    return ut || pt || u.property?.area || u.property?.city || u.property?.location || ''
}

const FALLBACK_LAT = 31.9539
const FALLBACK_LNG = 35.9106

const property = computed(() => {
    const u = res.value?.data ?? {}
    const imgs = (u.images && u.images.length) ? u.images.map(i => i.url || i) : (u.cover_image ? [u.cover_image] : [])
    const lat = u.latitude != null ? Number(u.latitude) : FALLBACK_LAT
    const lng = u.longitude != null ? Number(u.longitude) : FALLBACK_LNG
    const neighborhoods = (u.property?.neighborhoods ?? []).map(n => n?.name ?? n).filter(Boolean)
    return {
        id: u.id,
        property_id: u.property?.id ?? null,
        building: u.property?.name ?? '',
        reference: u.name,
        title: u.name,
        externalId: u.external_id ?? u.property?.external_id ?? null,
        location: localizedLocation(u),
        neighborhoods,
        type: u.unit_type_name || u.unit_type || '',
        listing: transactionLabel(u.transaction_type),
        listingVariant: transactionVariant(u.transaction_type),
        isForSale: !!u.is_for_sale,
        isForRent: !!u.is_for_rent,
        price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
        priceRaw: priceOf(u) ?? 0,
        currency: u.currency || u.property?.price_currency || 'JOD',
        deposit: Number(u.deposit) > 0 ? Number(u.deposit).toLocaleString('en-US') : '',
        bedrooms: u.bedrooms ?? 0,
        bathrooms: u.bathrooms ?? 0,
        area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
        parking: u.parking ?? 0,
        floor: u.floor ?? '',
        yearBuilt: u.year_built ?? '',
        furnishing: u.furnishing ?? '',
        descriptionHtml: u.marketing_description_html || '',
        description: u.marketing_description_plain || u.description || '',
        features: (u.amenities ?? []).map(a => a?.name ?? a),
        tags: (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(t => t.name),
        lat,
        lng,
        images: imgs.length ? imgs : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600'],
    }
})

const similar = computed(() => {
    const items = res.value?.data?.related_units ?? []
    return items
        .filter(u => u.id !== Number(route.params.id))
        .slice(0, 3)
        .map(u => {
            const tagList = (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(t => t.name)
            return {
                id: u.id,
                image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
                tag: transactionLabel(u.transaction_type),
                tagVariant: transactionVariant(u.transaction_type),
                tags: tagList,
                statusLabel: '',
                type: u.unit_type_name || u.unit_type || '',
                location: localizedLocation(u),
                building: u.property?.name || '',
                title: u.name,
                bedrooms: u.bedrooms ?? 0,
                bathrooms: u.bathrooms ?? 0,
                area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
                parking: u.parking ?? 0,
                currency: u.currency || u.property?.price_currency || 'JOD',
                price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
                pricePeriod: u.is_for_rent ? '/mo' : '',
            }
        })
})

useSeoMeta({
    title: computed(() => `${property.value.title} - Hayyak`),
    description: computed(() => property.value.description),
})
</script>
