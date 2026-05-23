<template>
    <div>
        <nav class="flex items-center gap-2 text-xs text-primary/60">
            <NuxtLink :to="{ name: 'home' }" class="hover:text-primary transition-colors">{{ t('nav_home') }}</NuxtLink>
            <LucideChevronRight class="size-3.5 rtl:rotate-180" />
            <NuxtLink :to="{ name: 'properties' }" class="hover:text-primary transition-colors">{{ t('nav_properties') }}</NuxtLink>
            <LucideChevronRight class="size-3.5 rtl:rotate-180" />
            <span class="text-secondary line-clamp-1">{{ property.title }}</span>
        </nav>

        <div class="flex flex-wrap gap-2 mt-7">
            <span class="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-secondary text-white">{{ property.listing }}</span>
            <span class="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-white border border-border text-secondary">{{ property.type }}</span>
        </div>

        <h1 class="font-display text-3xl md:text-4xl text-secondary font-bold mt-3">{{ property.title }}</h1>

        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-primary text-sm mt-3">
            <span class="flex items-center gap-1">
                <LucideMapPin class="size-4" />
                {{ property.location }}
            </span>
            <span class="text-secondary/30">•</span>
            <span class="text-primary/70 text-xs">{{ t('property_header_ref_label') }} {{ property.reference }}</span>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    property: { type: Object, required: true },
})
</script>
