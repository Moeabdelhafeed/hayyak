<template>
    <div>
        <DefaultBreadcrumb
            :items="[
                { name: t('nav_home', 'Home'), to: { name: 'home' } },
                { name: t('nav_properties', 'Properties'), to: { name: 'properties' } },
                { name: property.title },
            ]"
            class="text-xs text-primary/60"
        />

        <div class="flex flex-wrap gap-2 mt-7">
            <span
                :class="[
                    'text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md text-white',
                    property.listingVariant === 'sale' ? 'bg-brand-orange' : 'bg-brand-turquoise'
                ]"
            >{{ property.listing }}</span>
            <span class="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-brand-turquoise/10 border border-brand-turquoise/20 text-brand-turquoise">{{ property.type }}</span>
            <span
                v-for="tg in property.tags"
                :key="tg.name"
                class="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md border"
                :style="tg.color ? { color: tg.color, borderColor: `${tg.color}55`, backgroundColor: `${tg.color}15` } : { color: 'var(--brand-orange)', borderColor: 'color-mix(in srgb, var(--brand-orange) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--brand-orange) 10%, transparent)' }"
            >{{ tg.name }}</span>
        </div>

        <h1 class="font-display text-3xl md:text-4xl text-secondary font-bold mt-3">{{ property.title }}</h1>

        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-brand-turquoise text-sm mt-3">
            <span class="flex items-center gap-1">
                <LucideMapPin class="size-4" />
                {{ property.location }}<span v-if="property.neighborhoods?.length"> — {{ property.neighborhoods.join(', ') }}</span>
            </span>
            <span v-if="property.building" class="text-secondary/30">•</span>
            <span v-if="property.building" class="inline-flex items-center gap-1 text-brand-turquoise/80 text-xs">
                <LucideBuilding2 class="size-3.5" />
                {{ property.building }}
            </span>
            <span class="text-secondary/30">•</span>
            <span class="text-brand-turquoise/70 text-xs">{{ t('property_header_ref_label') }} {{ property.reference }}</span>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    property: { type: Object, required: true },
})
</script>
