<template>
    <div class="bg-white border border-brand-turquoise/15 rounded-xl p-5 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
        <div v-for="d in details" :key="d.label">
            <p class="text-brand-turquoise text-xs uppercase tracking-wider">{{ d.label }}</p>
            <p class="text-secondary text-sm font-medium mt-1">{{ d.value }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    property: { type: Object, required: true },
})

const { t } = useT()

const details = computed(() => [
    { label: t('property_details_floor'), value: props.property.floor },
    { label: t('property_details_year_built'), value: props.property.yearBuilt },
    { label: t('property_details_furnishing'), value: props.property.furnishing },
    { label: t('property_details_type'), value: props.property.type },
    { label: t('property_details_listing'), value: props.property.listing },
    { label: t('property_details_reference'), value: props.property.reference },
    { label: 'Building', value: props.property.building },
    { label: t('property_details_external_id', 'External ID'), value: props.property.externalId },
].filter(d => d.value !== '' && d.value !== null && d.value !== undefined))
</script>
