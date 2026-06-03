<template>
    <div>
        <div v-if="activeChips.length" class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-xs uppercase tracking-wider text-secondary/60 me-1">{{ t('properties_filters_title') }}:</span>
            <button
                v-for="c in activeChips"
                :key="c.key"
                type="button"
                class="inline-flex items-center gap-1.5 ps-3 pe-2 py-1.5 rounded-full text-xs font-medium bg-brand-turquoise/10 text-brand-turquoise border border-brand-turquoise/40 hover:bg-brand-turquoise/15 transition-colors"
                @click="clearChip(c.key)"
            >
                <span>{{ c.label }}</span>
                <LucideX class="size-3" />
            </button>
            <button
                type="button"
                class="text-xs text-brand-orange hover:underline ms-1"
                @click="clearAllChips"
            >
                {{ t('common_clear_all') }}
            </button>
        </div>
        <div class="flex items-center justify-between mb-6">
            <p class="text-secondary/90 flex items-center gap-2 text-sm">
                <span class="text-secondary font-bold">{{ total }}</span>
                <span class="text-primary">{{ t('properties_grid_found') }}</span>
            </p>
            <div class="flex items-center gap-1 bg-primary/5 border border-border rounded-lg p-1 ">
                <button
                    :class="[
                        'flex rounded-md items-center justify-center w-8 h-8 rounded-lg transition-colors',
                        view === 'grid' ? 'bg-white text-primary' : 'text-secondary/60 hover:text-primary'
                    ]"
                    @click="view = 'grid'"
                    :aria-label="t('properties_grid_view_grid')"
                >
                    <LucideLayoutGrid class="size-4 text-primary" />
                </button>
                <button
                    :class="[
                        'flex rounded-md items-center justify-center w-8 h-8 rounded-lg transition-colors',
                        view === 'map' ? 'bg-white text-primary' : 'text-secondary/60 hover:text-primary'
                    ]"
                    @click="view = 'map'"
                    :aria-label="t('properties_grid_view_map')"
                >
                    <LucideMap class="size-4 text-primary " />
                </button>
            </div>
        </div>

        <div v-if="view === 'grid' && properties.length === 0" class="w-full bg-white border border-brand-turquoise/15 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
            <div class="size-14 rounded-full bg-brand-turquoise/10 flex items-center justify-center">
                <LucideSearchX class="size-6 text-brand-turquoise" />
            </div>
            <p class="text-secondary font-display font-bold text-lg">{{ t('properties_grid_empty_title') }}</p>
            <p class="text-brand-turquoise/80 text-sm max-w-md">{{ t('properties_grid_empty_body') }}</p>
            <button
                v-if="activeChips.length"
                type="button"
                class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-brand-turquoise text-white hover:bg-brand-turquoise/90 transition-colors"
                @click="clearAllChips"
            >
                {{ t('common_clear_all') }}
            </button>
        </div>

        <div v-else-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <NuxtLink
                v-for="(p, i) in properties"
                :key="i"
                :to="{ name: 'property-detail', params: { id: p.id || i + 1 } }"
                class="block w-full min-w-0"
            >
                <CardsProperty
                    :image="p.image"
                    :tag="p.tag"
                    :tag-variant="p.tagVariant"
                    :type="p.type"
                    :status-label="p.statusLabel"
                    :tags="p.tags"
                    :location="p.location"
                    :title="p.title"
                    :building="p.building"
                    :bedrooms="p.bedrooms"
                    :bathrooms="p.bathrooms"
                    :area="p.area"
                    :parking="p.parking"
                    :currency="p.currency"
                    :price="p.price"
                    :price-period="p.pricePeriod"
                    show-view
                    class="h-[400px] w-full"
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
                        :aria-label="t('common_close')"
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
                :aria-label="t('properties_grid_prev_page')"
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
                :aria-label="t('properties_grid_next_page')"
            >
                <LucideChevronRight class="size-4 rtl:rotate-180" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { t } = useT()
const view = ref('grid')
const page = ref(1)
const selected = ref(null)
const locale = useCookie('locale', { default: () => 'en' })
const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', property_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', tag: '', sort: 'newest'
}))

const mapCenter = { lat: 31.9539, lng: 35.9106 }

const apiQuery = computed(() => ({
    keyword: filters.value.keyword || undefined,
    city_id: filters.value.city_id || undefined,
    area_id: filters.value.area_id || undefined,
    property_id: filters.value.property_id || undefined,
    unit_type: filters.value.unit_type || undefined,
    is_for_sale: filters.value.is_for_sale || undefined,
    is_for_rent: filters.value.is_for_rent || undefined,
    bedrooms: filters.value.bedrooms || undefined,
    bathrooms: filters.value.bathrooms || undefined,
    min_price: filters.value.min_price || undefined,
    max_price: filters.value.max_price || undefined,
    tag: filters.value.tag || undefined,
    page: page.value,
    per_page: 12,
}))

const { data: propsRes } = await useFetch('/api/units', {
    query: apiQuery,
    watch: [locale, apiQuery],
    key: 'units-list',
})

const transactionTag = (t) => t === 'sale' ? 'For Sale' : t === 'rent' ? 'For Rent' : ''
const transactionVariant = (t) => t === 'sale' ? 'sale' : 'rent'

const priceOf = (u) => u.sale_price ?? u.market_rent ?? null
const priceNumber = (formatted) => Number(String(formatted).replace(/[^\d.]/g, '')) || 0

const properties = computed(() => {
    const items = propsRes.value?.data?.data ?? []
    const mapped = items.map(u => {
        const lat = u.latitude != null ? Number(u.latitude) : mapCenter.lat
        const lng = u.longitude != null ? Number(u.longitude) : mapCenter.lng
        const tagList = (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(t => t.name)
        return {
            id: u.id,
            image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
            tag: transactionTag(u.transaction_type),
            tagVariant: transactionVariant(u.transaction_type),
            tags: tagList,
            statusLabel: (u.status && u.status !== 'Vacant') ? u.status : '',
            type: u.unit_type_name || u.unit_type || '',
            location: u.property?.area || u.property?.city || u.property?.location || '',
            title: u.name,
            building: u.property?.name || '',
            bedrooms: u.bedrooms ?? 0,
            bathrooms: u.bathrooms ?? 0,
            area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
            parking: u.parking ?? 0,
            currency: u.currency || u.property?.price_currency || 'JOD',
            price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
            pricePeriod: u.is_for_rent ? '/mo' : '',
            lat,
            lng,
        }
    })
    const sortKey = filters.value.sort
    if (sortKey === 'price-asc') mapped.sort((a, b) => priceNumber(a.price) - priceNumber(b.price))
    else if (sortKey === 'price-desc') mapped.sort((a, b) => priceNumber(b.price) - priceNumber(a.price))
    else if (sortKey === 'newest') mapped.sort((a, b) => b.id - a.id)
    return mapped
})

const { data: areasLookup } = await useFetch('/api/areas', {
    watch: [locale],
    key: `chips-areas-${locale.value}`,
})
const { data: typesLookup } = await useFetch('/api/units/types', {
    watch: [locale],
    key: `chips-types-${locale.value}`,
})
const { data: citiesLookup } = await useFetch('/api/cities', {
    watch: [locale],
    key: `chips-cities-${locale.value}`,
})
const { data: propertiesLookup } = await useFetch('/api/properties', {
    query: { per_page: 200 },
    watch: [locale],
    key: `chips-properties-${locale.value}`,
})

const areaName = (id) => (areasLookup.value?.data ?? []).find(a => String(a.id) === String(id))?.name || id
const typeName = (v) => (typesLookup.value?.data ?? []).find(ty => ty.value === v)?.name || v
const cityName = (id) => (citiesLookup.value?.data ?? []).find(c => String(c.id) === String(id))?.name || id
const buildingName = (id) => {
    const list = propertiesLookup.value?.data?.data ?? propertiesLookup.value?.data ?? []
    return list.find(p => String(p.id) === String(id))?.name || id
}

const activeChips = computed(() => {
    const f = filters.value
    const chips = []
    if (f.keyword) chips.push({ key: 'keyword', label: `${t('properties_filters_search_placeholder').replace('...', '')}: ${f.keyword}` })
    if (f.city_id) chips.push({ key: 'city_id', label: `${t('properties_filters_all_cities')}: ${cityName(f.city_id)}` })
    if (f.area_id) chips.push({ key: 'area_id', label: `${t('properties_filters_all_locations')}: ${areaName(f.area_id)}` })
    if (f.property_id) chips.push({ key: 'property_id', label: `${t('properties_filters_all_properties')}: ${buildingName(f.property_id)}` })
    if (f.unit_type) chips.push({ key: 'unit_type', label: typeName(f.unit_type) })
    if (f.is_for_sale === '1') chips.push({ key: 'is_for_sale', label: t('properties_filter_sale') })
    if (f.is_for_rent === '1') chips.push({ key: 'is_for_rent', label: t('properties_filter_rent') })
    if (f.bedrooms) chips.push({ key: 'bedrooms', label: `${f.bedrooms} ${t('properties_filters_bedrooms_suffix')}` })
    if (f.bathrooms) chips.push({ key: 'bathrooms', label: `${f.bathrooms} ${t('property_stats_bathrooms')}` })
    if (f.min_price) chips.push({ key: 'min_price', label: `${t('properties_filters_price_min')}: ${f.min_price}` })
    if (f.max_price) chips.push({ key: 'max_price', label: `${t('properties_filters_price_max')}: ${f.max_price}` })
    if (f.tag) chips.push({ key: 'tag', label: f.tag })
    return chips
})

const clearChip = (k) => {
    filters.value[k] = ''
    if (k === 'is_for_sale' || k === 'is_for_rent') {
        filters.value.is_for_sale = ''
        filters.value.is_for_rent = ''
    }
    page.value = 1
}
const clearAllChips = () => {
    Object.keys(filters.value).forEach(k => {
        if (k !== 'sort') filters.value[k] = ''
    })
    page.value = 1
}

const total = computed(() => propsRes.value?.data?.total ?? properties.value.length)
const lastPage = computed(() => propsRes.value?.data?.last_page ?? 1)
const pages = computed(() => {
    const lp = lastPage.value
    const max = Math.min(lp, 5)
    return Array.from({ length: max }, (_, i) => i + 1)
})
</script>
