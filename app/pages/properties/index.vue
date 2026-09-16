<template>
  <div>
    <PropertiesHero />
    <!-- No FadeIn wrapper here: it server-rendered the entire filters + results
             grid at opacity:0, so the LCP element stayed invisible until motion-v
             hydrated (and never appeared at all without JS). -->
    <section class="bg-[#f8fafb] py-12 md:py-20">
      <div class="mx-auto max-w-[1350px] px-4">
        <div class="mb-4 lg:hidden">
          <button
            type="button"
            class="border-brand-turquoise/30 text-secondary inline-flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3"
            @click="showFilters = !showFilters"
          >
            <span class="inline-flex items-center gap-2 text-sm font-medium">
              <LucideFilter class="text-brand-turquoise size-4" />
              {{ t('properties_filters_title') }}
            </span>
            <LucideChevronDown
              :class="['size-4 transition-transform', showFilters ? 'rotate-180' : '']"
            />
          </button>
        </div>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <div :class="[showFilters ? 'block' : 'hidden', 'lg:block']">
            <PropertiesFilters />
          </div>
          <PropertiesGrid />
        </div>
      </div>
    </section>

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
  keyword: '',
  city_id: '',
  area_id: '',
  property_id: '',
  unit_type: '',
  is_for_sale: '',
  is_for_rent: '',
  bedrooms: '',
  bathrooms: '',
  min_price: '',
  max_price: '',
  tag: '',
  sort: 'newest',
  page: 1,
}))

const FILTER_KEYS = [
  'keyword',
  'city_id',
  'area_id',
  'property_id',
  'unit_type',
  'is_for_sale',
  'is_for_rent',
  'bedrooms',
  'bathrooms',
  'min_price',
  'max_price',
  'tag',
  'sort',
  'page',
]

const hydrateFromQuery = () => {
  const q = route.query
  for (const k of FILTER_KEYS) {
    if (q[k] !== undefined) filters.value[k] = String(q[k])
  }
  // ?type=sale|rent comes from the navbar shortcuts. It is consumed into the
  // real filter flags and then dropped from the URL by the sync watcher below.
  if (q.type === 'sale') {
    filters.value.is_for_sale = '1'
    filters.value.is_for_rent = '0'
    filters.value.page = 1
  } else if (q.type === 'rent') {
    filters.value.is_for_sale = '0'
    filters.value.is_for_rent = '1'
    filters.value.page = 1
  }
}

hydrateFromQuery()
onMounted(hydrateFromQuery)

let syncing = false

// Clicking a navbar shortcut while already on /properties only changes the
// query — the page never remounts — so re-hydrate whenever the URL changes.
watch(
  () => route.query,
  () => {
    if (syncing) return
    hydrateFromQuery()
  },
  { deep: true },
)

watch(
  filters,
  (val) => {
    if (syncing) return
    syncing = true
    const q = { ...route.query }
    delete q.type
    for (const k of FILTER_KEYS) {
      const v = val[k]
      const isDefault = (k === 'sort' && v === 'newest') || (k === 'page' && Number(v) <= 1)
      if (v && !isDefault) q[k] = v
      else delete q[k]
    }
    router.replace({ query: q }).finally(() => {
      syncing = false
    })
  },
  { deep: true },
)

useSeoMeta({
  title: () => t('seo_properties_title'),
  description: () => t('seo_properties_description'),
})
</script>
