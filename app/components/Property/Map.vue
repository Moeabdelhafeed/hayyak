<template>
    <div>
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">{{ t('property_map_title') }}</h2>
        <div class="mt-4 rounded-lg overflow-hidden border border-border bg-white">
            <ScriptGoogleMaps
                :map-options="{ center: { lat, lng }, zoom: 14, mapId: 'DEMO_MAP_ID', mapTypeControl: false, streetViewControl: false }"
                class="!w-full !h-[250px]"
            >
                <ScriptGoogleMapsMarker :position="{ lat, lng }">
                    <template #content>
                        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-md bg-primary">
                            <LucideMapPin class="size-3.5" />
                            {{ title }}
                        </div>
                    </template>
                </ScriptGoogleMapsMarker>
            </ScriptGoogleMaps>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
defineProps({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    title: { type: String, default: '' },
})
</script>
