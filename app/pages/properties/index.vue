<template>
    <div>
        <PropertiesHero />
        <DefaultFadeIn>
            <section class="py-12 md:py-20 bg-[#f8fafb]">
                <div class="px-4 max-w-[1350px] mx-auto">
                    <div class="lg:hidden mb-4">
                        <button
                            type="button"
                            class="w-full inline-flex items-center justify-between px-4 py-3 rounded-lg border border-brand-turquoise/30 bg-white text-secondary"
                            @click="showFilters = !showFilters"
                        >
                            <span class="inline-flex items-center gap-2 text-sm font-medium">
                                <LucideFilter class="size-4 text-brand-turquoise" />
                                {{ t('properties_filters_title') }}
                            </span>
                            <LucideChevronDown :class="['size-4 transition-transform', showFilters ? 'rotate-180' : '']" />
                        </button>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
                        <div :class="[showFilters ? 'block' : 'hidden', 'lg:block']">
                            <PropertiesFilters />
                        </div>
                        <PropertiesGrid />
                    </div>
                </div>
            </section>
        </DefaultFadeIn>

        <DefaultFadeIn><DefaultCta /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

definePageMeta({ name: 'properties' })

const { t } = useT()
const showFilters = ref(false)

const route = useRoute()
const router = useRouter()

const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', property_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', tag: '', sort: 'newest', page: 1
}))

const FILTER_KEYS = [
    'keyword', 'city_id', 'area_id', 'property_id', 'unit_type',
    'is_for_sale', 'is_for_rent', 'bedrooms', 'bathrooms',
    'min_price', 'max_price', 'tag', 'sort', 'page',
]

const hydrateFromQuery = () => {
    const q = route.query
    for (const k of FILTER_KEYS) {
        if (q[k] !== undefined) filters.value[k] = String(q[k])
    }
    if (q.type === 'sale') { filters.value.is_for_sale = '1'; filters.value.is_for_rent = '0' }
    else if (q.type === 'rent') { filters.value.is_for_sale = '0'; filters.value.is_for_rent = '1' }
}

hydrateFromQuery()
onMounted(hydrateFromQuery)

let syncing = false
watch(filters, (val) => {
    if (syncing) return
    syncing = true
    const q = { ...route.query }
    for (const k of FILTER_KEYS) {
        const v = val[k]
        const isDefault = (k === 'sort' && v === 'newest') || (k === 'page' && Number(v) <= 1)
        if (v && !isDefault) q[k] = v
        else delete q[k]
    }
    router.replace({ query: q }).finally(() => { syncing = false })
}, { deep: true })

useSeoMeta({
    title: () => t('seo_properties_title'),
    description: () => t('seo_properties_description'),
})
</script>
