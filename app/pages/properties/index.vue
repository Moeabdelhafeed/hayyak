<template>
    <div>
        <PropertiesHero />
        <DefaultFadeIn>
            <section class="py-12 md:py-20 bg-[#f8fafb]">
                <div class="px-4 max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
                    <PropertiesFilters />
                    <PropertiesGrid />
                </div>
            </section>
        </DefaultFadeIn>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
definePageMeta({ name: 'properties' })

useSeoMeta({
    title: 'Properties - Hayyak',
    description: 'Browse handpicked apartments, villas, and commercial spaces across Jordan.',
})
</script>
