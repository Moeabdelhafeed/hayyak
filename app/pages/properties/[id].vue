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
definePageMeta({ name: 'property-detail' })

const route = useRoute()

const property = {
    id: route.params.id,
    reference: 'HYK-009',
    title: 'Open-Plan Luxury Flat – Deir Ghbar',
    location: 'Deir Ghbar',
    type: 'Apartment',
    listing: 'For Sale',
    listingVariant: 'sale',
    price: '165,000',
    currency: 'JOD',
    bedrooms: 2,
    bathrooms: 2,
    area: 175,
    parking: 1,
    floor: '4',
    yearBuilt: '2019',
    furnishing: 'Unfurnished',
    description: 'An elegant open-plan apartment in the quiet, tree-lined streets of Deir Ghbar. High ceilings, a bespoke kitchen island, and generous natural light create a refined living environment minutes from Abdoun and Sweifieh.',
    features: ['Open-Plan Living', 'High Ceilings', 'Kitchen Island', 'Natural Light', 'Balcony', 'Parking Space', 'Central Heating', 'Modern Finishes'],
    lat: 31.9460,
    lng: 35.8512,
    images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600',
    ],
}

const similar = [
    { id: 'HYK-002', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Apartment', location: 'Abdoun', title: 'Modern Apartment – Abdoun Circle', bedrooms: 3, bathrooms: 2, area: 200, price: '195,000' },
    { id: 'HYK-003', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Studio', location: 'Abdali', title: 'Designer Studio – Abdali Boulevard', bedrooms: 1, bathrooms: 1, area: 70, price: '75,000' },
    { id: 'HYK-004', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Penthouse', location: 'Abdali', title: 'Skyline Penthouse – Abdali Boulevard', bedrooms: 4, bathrooms: 3, area: 280, price: '320,000' },
]

useSeoMeta({
    title: `${property.title} - Hayyak`,
    description: property.description,
})
</script>
