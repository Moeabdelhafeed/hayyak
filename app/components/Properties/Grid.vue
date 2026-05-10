<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <p class="text-secondary/90 flex items-center gap-2 text-sm">
                <span class="text-secondary font-bold">{{ properties.length }}</span>
                <span class="text-primary">properties found</span>  
            </p>
            <div class="flex items-center gap-1 bg-primary/5 border border-border rounded-lg p-1 ">
                <button
                    :class="[
                        'flex rounded-md items-center justify-center w-8 h-8 rounded-lg transition-colors',
                        view === 'grid' ? 'bg-white text-primary' : 'text-secondary/60 hover:text-primary'
                    ]"
                    @click="view = 'grid'"
                    aria-label="Grid view"
                >
                    <LucideLayoutGrid class="size-4 text-primary" />
                </button>
                <button
                    :class="[
                        'flex rounded-md items-center justify-center w-8 h-8 rounded-lg transition-colors',
                        view === 'map' ? 'bg-white text-primary' : 'text-secondary/60 hover:text-primary'
                    ]"
                    @click="view = 'map'"
                    aria-label="Map view"
                >
                    <LucideMap class="size-4 text-primary " />
                </button>
            </div>
        </div>

        <div v-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <NuxtLink
                v-for="(p, i) in properties"
                :key="i"
                :to="{ name: 'property-detail', params: { id: p.id || i + 1 } }"
            >
                <CardsProperty
                    :image="p.image"
                    :tag="p.tag"
                    :tag-variant="p.tagVariant"
                    :type="p.type"
                    :status-label="p.statusLabel"
                    :status-variant="p.statusVariant"
                    :location="p.location"
                    :title="p.title"
                    :bedrooms="p.bedrooms"
                    :bathrooms="p.bathrooms"
                    :area="p.area"
                    :price="p.price"
                    price-period="/mo"
                    show-view
                    class="h-100"
                />
            </NuxtLink>
        </div>

        <div v-else class="w-full relative rounded-lg overflow-hidden border border-border bg-white">
            <ScriptGoogleMaps
                :map-options="{ center: mapCenter, zoom: 11, mapId: 'DEMO_MAP_ID', mapTypeControl: false, streetViewControl: false }"
                class="!w-full h-[640px] object-cover"
            >
                <ScriptGoogleMapsMarker
                    v-for="(p, i) in properties"
                    :key="i"
                    :position="{ lat: p.lat, lng: p.lng }"
                    @click="selected = p"
                >
                    <template #content>
                        <div
                            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-md cursor-pointer hover:scale-110 transition-transform bg-primary"
                        >
                            <LucideHome class="size-3.5" />
                            JOD {{ p.price }}
                        </div>
                    </template>
                </ScriptGoogleMapsMarker>
            </ScriptGoogleMaps>

            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0 translate-y-2"
            >
                <div
                    v-if="selected"
                    class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[420px] bg-white rounded-lg border border-border shadow-xl overflow-hidden flex items-stretch"
                >
                    <NuxtLink
                        :to="{ name: 'property-detail', params: { id: selected.id || properties.indexOf(selected) + 1 } }"
                        class="flex flex-1 items-stretch hover:bg-primary/5 transition-colors"
                    >
                        <img :src="selected.image" class="w-32 self-stretch object-cover shrink-0" :alt="selected.title">
                        <div class="flex-1 p-3 flex flex-col">
                            <div class="flex items-center gap-1 text-primary text-xs">
                                <LucideMapPin class="size-3" /> {{ selected.location }}
                            </div>
                            <p class="text-secondary text-sm font-semibold line-clamp-1 mt-1">{{ selected.title }}</p>
                            <div class="flex gap-3 text-primary/80 text-xs mt-1">
                                <span class="flex items-center gap-1"><LucideBed class="size-3" />{{ selected.bedrooms }}</span>
                                <span class="flex items-center gap-1"><LucideBath class="size-3" />{{ selected.bathrooms }}</span>
                                <span class="flex items-center gap-1"><LucideScale3D class="size-3" />{{ selected.area }} sqm</span>
                            </div>
                            <div class="mt-auto flex items-center justify-between pt-2">
                                <div class="text-primary font-bold text-sm">JOD {{ selected.price }}<span class="text-primary text-xs font-normal">/mo</span></div>
                                <Button variant="outline" class="h-7 px-3 text-xs rounded-md text-primary border-primary/30 hover:bg-primary hover:text-white">View</Button>
                            </div>
                        </div>
                    </NuxtLink>
                    <button
                        class="absolute top-2 end-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 hover:bg-white text-secondary/60 hover:text-secondary border border-border"
                        aria-label="Close"
                        @click="selected = null"
                    >
                        <LucideX class="size-4" />
                    </button>
                </div>
            </Transition>
        </div>

        <div v-if="view === 'map'" class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            <button
                v-for="(p, i) in properties"
                :key="i"
                :class="[
                    'flex items-center gap-3 p-3 rounded-lg border bg-white text-start transition-colors hover:border-primary',
                    selected?.title === p.title ? 'border-primary border-2' : 'border-border'
                ]"
                @click="selected = p"
            >
                <img :src="p.image" class="w-24 h-18 object-cover rounded-md shrink-0" :alt="p.title">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1 text-primary text-xs">
                        <LucideMapPin class="size-3" /> {{ p.location }}
                    </div>
                    <p class="text-secondary text-sm font-semibold line-clamp-1 mt-0.5">{{ p.title }}</p>
                    <p class="text-primary font-bold text-sm mt-1">JOD {{ p.price }}</p>
                </div>
            </button>
        </div>

        <div v-if="view === 'grid'" class="flex items-center justify-center gap-3 mt-10">
            <button
                class="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-transparent text-secondary hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary transition-colors"
                :disabled="page === 1"
                @click="page = Math.max(1, page - 1)"
                aria-label="Previous page"
            >
                <LucideChevronLeft class="size-4 rtl:rotate-180" />
            </button>
            <button
                v-for="p in pages"
                :key="p"
                :class="[
                    'flex items-center justify-center w-10 h-10 rounded-full text-sm transition-colors',
                    page === p
                        ? 'bg-primary text-white border border-primary'
                        : 'bg-transparent text-secondary/80 border border-border hover:border-primary hover:text-primary'
                ]"
                @click="page = p"
            >
                {{ p }}
            </button>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-transparent text-secondary hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary transition-colors"
                :disabled="page === pages.length"
                @click="page = Math.min(pages.length, page + 1)"
                aria-label="Next page"
            >
                <LucideChevronRight class="size-4 rtl:rotate-180" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const view = ref('grid')
const page = ref(1)
const pages = [1, 2, 3, 4, 5]
const selected = ref(null)

const mapCenter = { lat: 31.9539, lng: 35.9106 }

const variantColor = {
    rent: '#1f3b4a',
    sale: '#1f3b4a',
    new: '#2c6e8f',
    commercial: '#ec4899',
    seaview: '#3b82f6',
}


const properties = [
    { image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', tag: 'For Rent', tagVariant: 'rent', type: 'Studio', location: 'Abdoun', title: 'Modern Studio – Abdoun Heights', bedrooms: 1, bathrooms: 1, area: 65, price: '450', lat: 31.9357, lng: 35.8770 },
    { image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', tag: 'For Rent', tagVariant: 'rent', type: 'Villa', location: 'Dabouq', title: 'Pool Villa – Dabouq Estates', bedrooms: 5, bathrooms: 4, area: 620, price: '3,200', lat: 31.9842, lng: 35.8358 },
    { image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800', tag: 'For Rent', tagVariant: 'rent', statusLabel: 'Commercial', statusVariant: 'commercial', type: 'Office / Commercial', location: 'Abdali', title: 'Retail Floor – Abdali Boulevard', bedrooms: 0, bathrooms: 2, area: 420, price: '5,800', lat: 31.9628, lng: 35.9106 },
    { image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Apartment', location: 'Shmeisani', title: 'Skyline Apartment – Shmeisani', bedrooms: 3, bathrooms: 2, area: 210, price: '186,000', lat: 31.9700, lng: 35.9020 },
    { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Penthouse', location: 'Abdoun', title: 'Penthouse Duplex – Abdoun', bedrooms: 4, bathrooms: 4, area: 380, price: '720,000', lat: 31.9300, lng: 35.8810 },
    { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', tag: 'For Rent', tagVariant: 'rent', type: 'Apartment', location: 'Deir Ghbar', title: 'Garden Apartment – Deir Ghbar', bedrooms: 3, bathrooms: 2, area: 240, price: '1,400', lat: 31.9460, lng: 35.8512 },
    { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', tag: 'For Sale', tagVariant: 'sale', statusLabel: 'Sea View', statusVariant: 'seaview', type: 'Villa', location: 'Aqaba', title: 'Sea View Villa – Aqaba', bedrooms: 6, bathrooms: 5, area: 800, price: '1,250,000', lat: 29.5267, lng: 35.0078 },
    { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Apartment', location: 'Sweifieh', title: 'Family Apartment – Sweifieh', bedrooms: 3, bathrooms: 3, area: 220, price: '215,000', lat: 31.9438, lng: 35.8650 },
    { image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', tag: 'For Rent', tagVariant: 'rent', type: 'Studio', location: 'Abdali', title: 'Boulevard Studio – Abdali', bedrooms: 1, bathrooms: 1, area: 70, price: '600', lat: 31.9640, lng: 35.9085 },
    { image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', tag: 'For Sale', tagVariant: 'sale', type: 'Townhouse', location: 'Dabouq', title: 'Modern Townhouse – Dabouq', bedrooms: 4, bathrooms: 3, area: 320, price: '395,000', lat: 31.9870, lng: 35.8330 },
    { image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800', tag: 'For Rent', tagVariant: 'rent', type: 'Apartment', location: 'Jabal Amman', title: 'Heritage Apartment – Jabal Amman', bedrooms: 2, bathrooms: 1, area: 140, price: '850', lat: 31.9530, lng: 35.9270 },
    { image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', tag: 'For Rent', tagVariant: 'rent', statusLabel: 'Commercial', statusVariant: 'commercial', type: 'Office', location: 'Shmeisani', title: 'Corporate Office – Shmeisani Tower', bedrooms: 0, bathrooms: 3, area: 280, price: '3,400', lat: 31.9695, lng: 35.9050 },
]
</script>
