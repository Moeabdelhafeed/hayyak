<template>
    <div class="group flex hover:shadow-lg transition-all duration-300 flex-col rounded-lg border overflow-hidden cursor-pointer">
        <div class="w-full flex-1 relative overflow-hidden">
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
                    statusClass
                ]"
            >
                {{ statusLabel }}
            </div>

            <img
                :src="image"
                :alt="title"
                class="object-cover group-hover:scale-110 transition-all duration-500 h-full object-center w-full"
            >
        </div>
        <div class="w-full h-max bg-white flex flex-col p-4">
            <div class="flex flex-col gap-2">
                <div class="flex gap-1 items-center text-primary/90 text-sm">
                    <LucideMapPin class="size-4" /> {{ location }}
                </div>
                <div class="text-secondary w-full text-sm line-clamp-1">
                    {{ title }}
                </div>

                <div class="flex gap-5 text-primary/90">
                    <div class="flex items-center gap-1 text-sm">
                        <LucideBed class="size-3" /> {{ bedrooms }}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <LucideBath class="size-3" /> {{ bathrooms }}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <LucideScale3D class="size-3" /> {{ area }} sqm
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
                <span class="text-xs">

                    View
                </span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideScale3D } from 'lucide-vue-next'

const props = defineProps({
    image: { type: String, default: 'https://picsum.photos/200/300' },
    tag: { type: String, default: '' },
    tagVariant: { type: String, default: 'primary' },
    type: { type: String, default: '' },
    statusLabel: { type: String, default: '' },
    statusVariant: { type: String, default: 'primary' },
    location: { type: String, default: '' },
    title: { type: String, default: '' },
    bedrooms: { type: [Number, String], default: 0 },
    bathrooms: { type: [Number, String], default: 0 },
    area: { type: [Number, String], default: 0 },
    currency: { type: String, default: 'JOD' },
    price: { type: [Number, String], default: '' },
    pricePeriod: { type: String, default: '' },
    showView: { type: Boolean, default: false },
})

const variantMap = {
    primary: 'bg-primary text-white',
    rent: 'bg-primary text-white',
    sale: 'bg-primary text-white',
    new: 'bg-primary text-white',
    commercial: 'bg-purple-500 text-white',
    seaview: 'bg-blue-400 text-white',
}

const tagClass = computed(() => variantMap[props.tagVariant] || variantMap.primary)
const statusClass = computed(() => variantMap[props.statusVariant] || variantMap.primary)
</script>

<style scoped></style>
