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

// The URL is a projection of `filters`. Defining that projection once lets the
// route watcher tell OUR OWN url echo apart from a real external change (pasted
// link, navbar shortcut, back button) without a timing flag.
const queryFromFilters = (val) => {
  const q = {}
  for (const k of FILTER_KEYS) {
    const v = val[k]
    const isDefault =
      (k === 'sort' && v === 'newest') ||
      (k === 'page' && Number(v) <= 1) ||
      // '0' is a truthy string, so these used to be written to the URL as
      // `is_for_sale=0`; they carry no meaning and the API ignores them.
      ((k === 'is_for_sale' || k === 'is_for_rent') && String(v) === '0')
    if (v && !isDefault) q[k] = String(v)
  }
  return q
}

const sameQuery = (a, b) => {
  const ka = Object.keys(a)
  return ka.length === Object.keys(b).length && ka.every((k) => String(a[k]) === String(b[k]))
}

// Re-hydrate only on a genuinely external URL change. The previous version guarded
// with a `syncing` boolean cleared in router.replace().finally() — but replace() is
// async and every keystroke queues another one, so the flag cleared while a newer
// navigation was still in flight. This watcher then fired and wrote the stale query
// back over the text being typed: the input said "oooo" while the URL said
// "keyword=o", and deleting the text left the old keyword stuck in the URL.
watch(
  () => route.query,
  (q) => {
    const incoming = { ...q }
    delete incoming.type
    if (q.type === undefined && sameQuery(incoming, queryFromFilters(filters.value))) return
    hydrateFromQuery()
  },
  { deep: true },
)

watch(
  filters,
  (val) => {
    const q = queryFromFilters(val)
    const current = { ...route.query }
    delete current.type
    // Also drops a leftover ?type=sale|rent once it has been consumed.
    if (route.query.type !== undefined || !sameQuery(current, q)) router.replace({ query: q })
  },
  { deep: true },
)

useSeoMeta({
  title: () => t('seo_properties_title'),
  description: () => t('seo_properties_description'),
})
</script>
