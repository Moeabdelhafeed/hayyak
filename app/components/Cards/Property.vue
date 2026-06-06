<template>
    <div class="group flex hover:shadow-lg transition-all duration-300 flex-col rounded-lg border overflow-hidden cursor-pointer min-w-0">
        <div class="w-full aspect-4/3 relative overflow-hidden">
            <div
                v-if="tag"
                :class="[
                    'absolute top-4 start-4 z-10 text-[11px] font-semibold tracking-wider uppercase rounded-md px-2.5 py-1 w-max',
                    tagClass
                ]"
            >
                {{ tag }}
            </div>

            <div
                v-if="type"
                class="absolute top-4 end-4 z-10 text-xs bg-white text-secondary rounded-md px-2.5 py-1 w-max shadow-sm"
            >
                {{ type }}
            </div>

            <div
                v-if="statusLabel"
                :class="[
                    'absolute bottom-4 end-4 z-10 text-[11px] font-semibold tracking-wider uppercase rounded-md px-2.5 py-1 w-max',
                    statusColor ? '' : statusClass
                ]"
                :style="statusColor ? { color: '#fff', backgroundColor: statusColor } : null"
            >
                {{ statusLabel }}
            </div>

            <img
                :src="image"
                :alt="title"
                class="object-cover group-hover:scale-110 transition-all duration-500 h-full object-center w-full"
            >

            <div v-if="visibleTags.length" class="absolute bottom-4 start-4 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-2rem)]">
                <span
                    v-for="tg in visibleTags"
                    :key="tg.name"
                    class="text-[11px] font-semibold tracking-wider uppercase rounded-md px-2.5 py-1 w-max text-white shadow-sm"
                    :class="tg.color ? '' : 'bg-primary'"
                    :style="tg.color ? { backgroundColor: tg.color } : null"
                >
                    {{ tg.name }}
                </span>
                <span
                    v-if="extraTags"
                    class="text-[11px] font-semibold tracking-wider uppercase rounded-md px-2.5 py-1 w-max bg-secondary text-white shadow-sm"
                >+{{ extraTags }}</span>
            </div>
        </div>
        <div class="w-full h-max bg-white flex flex-col p-4">
            <div class="flex flex-col gap-2">
                <div class="flex gap-1 items-center text-primary/90 text-sm min-w-0">
                    <LucideMapPin class="size-4 shrink-0" /> <span class="line-clamp-1">{{ location }}</span>
                </div>
                <div class="text-secondary w-full text-sm line-clamp-1 font-medium">
                    {{ title }}
                </div>
                <div v-if="building" class="text-primary/70 text-xs flex items-center gap-1 -mt-1 min-w-0">
                    <LucideBuilding2 class="size-3 shrink-0" /> <span class="line-clamp-1">{{ building }}</span>
                </div>

                <div class="flex flex-wrap gap-x-5 gap-y-1 text-primary/90">
                    <div class="flex items-center gap-1 text-sm">
                        <LucideBed class="size-3" /> {{ bedrooms }}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <LucideBath class="size-3" /> {{ bathrooms }}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <LucideScale3D class="size-3" /> {{ area }} {{ t('property_card_area_unit') }}
                    </div>
                    <div v-if="parking" class="flex items-center gap-1 text-sm">
                        <LucideCar class="size-3" /> {{ parking }}
                    </div>
                </div>
            </div>

            <hr class="my-3 border-secondary/8">

            <div class="flex items-center justify-between">
                <div class="text-primary text-lg font-bold">
                    {{ currency }} {{ price }}<span v-if="pricePeriod" class="text-primary font-normal text-sm">{{ pricePeriod }}</span>
                </div>
                <Button
                    v-if="showView"
                    variant="outline"
                    class=" !px-3 !py-1   rounded-lg text-primary border-primary/30 hover:bg-primary hover:text-white "
                >
                    <span class="text-xs">{{ t('property_card_view') }}</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideScale3D, LucideCar } from 'lucide-vue-next'

const { t } = useT()

const props = defineProps({
    image: { type: String, default: 'https://picsum.photos/200/300' },
    tag: { type: String, default: '' },
    tagVariant: { type: String, default: 'primary' },
    type: { type: String, default: '' },
    statusLabel: { type: String, default: '' },
    statusVariant: { type: String, default: 'primary' },
    statusColor: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    location: { type: String, default: '' },
    title: { type: String, default: '' },
    building: { type: String, default: '' },
    bedrooms: { type: [Number, String], default: 0 },
    bathrooms: { type: [Number, String], default: 0 },
    area: { type: [Number, String], default: 0 },
    parking: { type: [Number, String], default: 0 },
    currency: { type: String, default: 'JOD' },
    price: { type: [Number, String], default: '' },
    pricePeriod: { type: String, default: '' },
    showView: { type: Boolean, default: false },
})

const variantMap = {
    primary: 'bg-primary text-white',
    rent: 'bg-brand-cyan text-white',
    sale: 'bg-brand-orange text-white',
    new: 'bg-brand-orange text-white',
    featured: 'bg-brand-orange text-white shadow-[0_0_18px_rgba(255,107,38,0.55)]',
    hot: 'bg-brand-red text-white',
    commercial: 'bg-brand-cyan text-white',
    seaview: 'bg-brand-cyan-neon text-secondary shadow-[0_0_14px_rgba(85,255,255,0.7)]',
}

const tagClass = computed(() => variantMap[props.tagVariant] || variantMap.primary)
const statusClass = computed(() => variantMap[props.statusVariant] || variantMap.primary)

const MAX_TAGS = 3
const cleanTags = computed(() => (props.tags || []).filter(x => x && x.name))
const visibleTags = computed(() => cleanTags.value.slice(0, MAX_TAGS))
const extraTags = computed(() => Math.max(0, cleanTags.value.length - MAX_TAGS))
</script>

<style scoped></style>
