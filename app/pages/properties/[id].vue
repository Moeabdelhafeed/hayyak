<template>
    <div class="bg-[#f8fafb]">
        <PropertyGallery
            :images="property.images"
            :title="property.title"
        />

        <section class="py-8 md:py-10">
            <div class="px-4 max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                <div class="flex flex-col gap-8">
                    <DefaultFadeIn><PropertyHeader :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyStats :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyDetails :property="property" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyAbout :description="property.description" /></DefaultFadeIn>
                    <DefaultFadeIn><PropertyFeatures :features="property.features" /></DefaultFadeIn>
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

const parseLatLng = (loc) => {
    if (!loc || typeof loc !== 'string') return { lat: 31.9539, lng: 35.9106 }
    const m = loc.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/)
    return m ? { lat: Number(m[1]), lng: Number(m[2]) } : { lat: 31.9539, lng: 35.9106 }
}

const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

const property = computed(() => {
    const u = res.value?.data ?? {}
    const imgs = (u.images && u.images.length) ? u.images.map(i => i.url || i) : (u.cover_image ? [u.cover_image] : [])
    const { lat, lng } = parseLatLng(u.property?.location)
    return {
        id: u.id,
        reference: u.name,
        title: u.name,
        location: u.property?.area || u.property?.city || '',
        type: u.unit_type_name || u.unit_type || '',
        listing: transactionLabel(u.transaction_type),
        listingVariant: transactionVariant(u.transaction_type),
        price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
        currency: u.currency || u.property?.price_currency || 'JOD',
        bedrooms: u.bedrooms ?? 0,
        bathrooms: u.bathrooms ?? 0,
        area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
        parking: u.parking ?? 0,
        floor: u.floor ?? '',
        yearBuilt: u.year_built ?? '',
        furnishing: u.furnishing ?? '',
        description: u.marketing_description_plain || u.description || '',
        features: (u.amenities ?? []).map(a => a?.name ?? a),
        lat,
        lng,
        images: imgs.length ? imgs : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600'],
    }
})

const propertyId = computed(() => res.value?.data?.property?.id)

const { data: similarRes } = await useFetch('/api/units', {
    query: computed(() => ({ property_id: propertyId.value, per_page: 6 })),
    watch: [locale, propertyId],
    key: 'unit-similar',
})

const similar = computed(() => {
    const items = similarRes.value?.data?.data ?? []
    return items
        .filter(u => u.id !== Number(route.params.id))
        .slice(0, 3)
        .map(u => ({
            id: u.id,
            image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            tag: transactionLabel(u.transaction_type),
            tagVariant: transactionVariant(u.transaction_type),
            type: u.unit_type_name || u.unit_type || '',
            location: u.property?.area || u.property?.city || '',
            title: u.name,
            bedrooms: u.bedrooms ?? 0,
            bathrooms: u.bathrooms ?? 0,
            area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
            price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
        }))
})

useSeoMeta({
    title: computed(() => `${property.value.title} - Hayyak`),
    description: computed(() => property.value.description),
})
</script>
