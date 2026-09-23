<template>
  <div ref="root">
    <div v-if="activeChips.length" class="mb-4 flex flex-wrap items-center gap-2">
      <span class="text-secondary/60 me-1 text-xs tracking-wider uppercase">
        {{ t('properties_filters_title') }}:
      </span>
      <button
        v-for="c in activeChips"
        :key="c.key"
        type="button"
        class="bg-brand-turquoise/10 text-brand-turquoise border-brand-turquoise/40 hover:bg-brand-turquoise/15 inline-flex items-center gap-1.5 rounded-full border py-1.5 ps-3 pe-2 text-xs font-medium transition-colors"
        @click="clearChip(c.key)"
      >
        <span>{{ c.label }}</span>
        <LucideX class="size-3" />
      </button>
      <button
        type="button"
        class="text-brand-orange ms-1 text-xs hover:underline"
        @click="clearAllChips"
      >
        {{ t('common_clear_all') }}
      </button>
    </div>
    <div class="mb-6 flex items-center justify-between">
      <p class="text-secondary/90 flex items-center gap-2 text-sm">
        <span v-if="pending" class="shimmer inline-block h-4 w-8 rounded" />
        <span v-else class="text-secondary font-bold">{{ total }}</span>
        <span class="text-primary">{{ t('properties_grid_found') }}</span>
      </p>
      <div class="bg-primary/5 border-border flex items-center gap-1 rounded-lg border p-1">
        <button
          :class="[
            'flex h-8 w-8 items-center justify-center rounded-lg rounded-md transition-colors',
            view === 'grid' ? 'text-primary bg-white' : 'text-secondary/60 hover:text-primary',
          ]"
          @click="view = 'grid'"
          :aria-label="t('properties_grid_view_grid')"
        >
          <LucideLayoutGrid class="text-primary size-4" />
        </button>
        <button
          :disabled="!properties.length"
          :class="[
            'flex h-8 w-8 items-center justify-center rounded-lg rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            view === 'map' ? 'text-primary bg-white' : 'text-secondary/60 hover:text-primary',
          ]"
          @click="view = 'map'"
          :aria-label="t('properties_grid_view_map')"
        >
          <LucideMap class="text-primary size-4" />
        </button>
      </div>
    </div>

    <div
      v-if="pending && view === 'grid'"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      :aria-label="t('properties_grid_found')"
    >
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="border-border flex h-[400px] w-full flex-col overflow-hidden rounded-xl border bg-white"
      >
        <div class="shimmer h-52 w-full" />
        <div class="flex flex-1 flex-col gap-3 p-4">
          <div class="shimmer h-3 w-1/3 rounded" />
          <div class="shimmer h-4 w-4/5 rounded" />
          <div class="shimmer h-3 w-1/2 rounded" />
          <div class="mt-auto flex items-center gap-3">
            <div class="shimmer h-3 w-10 rounded" />
            <div class="shimmer h-3 w-10 rounded" />
            <div class="shimmer h-3 w-12 rounded" />
          </div>
          <div class="shimmer h-5 w-1/3 rounded" />
        </div>
      </div>
    </div>

    <div
      v-else-if="view === 'grid' && properties.length === 0"
      class="border-brand-turquoise/15 flex w-full flex-col items-center justify-center gap-3 rounded-xl border bg-white p-10 text-center"
    >
      <div class="bg-brand-turquoise/10 flex size-14 items-center justify-center rounded-full">
        <LucideSearchX class="text-brand-turquoise size-6" />
      </div>
      <p class="text-secondary font-display text-lg font-bold">
        {{ t('properties_grid_empty_title') }}
      </p>
      <p class="text-brand-turquoise/80 max-w-md text-sm">{{ t('properties_grid_empty_body') }}</p>
      <button
        v-if="activeChips.length"
        type="button"
        class="bg-brand-turquoise hover:bg-brand-turquoise/90 mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-white transition-colors"
        @click="clearAllChips"
      >
        {{ t('common_clear_all') }}
      </button>
    </div>

    <div v-else-if="view === 'grid'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLinkLocale
        v-for="(p, i) in properties"
        :key="i"
        :to="{ name: 'property-detail', params: { slug: p.slug || String(p.id || i + 1) } }"
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
      </NuxtLinkLocale>
    </div>

    <div v-else class="border-border relative w-full overflow-hidden rounded-lg border bg-white">
      <ScriptGoogleMaps
        :map-options="{
          center: mapCenter,
          zoom: 11,
          mapId: 'DEMO_MAP_ID',
          mapTypeControl: false,
          streetViewControl: false,
        }"
        class="h-[640px] !w-full object-cover"
      >
        <ScriptGoogleMapsMarkerClusterer>
          <ScriptGoogleMapsMarker
            v-for="(g, i) in mapGroups"
            :key="i"
            :position="{ lat: g.lat, lng: g.lng }"
            @click="selected = g.units"
          >
            <template #content>
              <div
                class="bg-primary flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-white shadow-md transition-transform hover:scale-110"
              >
                <template v-if="g.units.length > 1">
                  <LucideLayers class="size-3.5" />
                  {{ g.units.length }} {{ t('properties_grid_units_here') }}
                </template>
                <template v-else>
                  <LucideHome class="size-3.5" />
                  JOD {{ g.units[0].price }}
                </template>
              </div>
            </template>
          </ScriptGoogleMapsMarker>

          <template #renderer="{ cluster }">
            <div
              class="bg-primary ring-primary/30 flex items-center justify-center rounded-full font-bold text-white shadow-lg ring-4"
              style="width: 44px; height: 44px"
            >
              {{ cluster.count }}
            </div>
          </template>
        </ScriptGoogleMapsMarkerClusterer>
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
          v-if="selected?.length"
          class="border-border absolute bottom-4 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-xl border bg-white shadow-xl sm:w-[420px]"
        >
          <button
            class="text-secondary/60 hover:text-secondary border-border absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-sm hover:bg-white"
            :aria-label="t('common_close')"
            @click="selected = null"
          >
            <LucideX class="size-4" />
          </button>

          <p
            v-if="selected.length > 1"
            class="text-secondary flex items-center gap-1.5 px-4 pe-14 pt-4 pb-1 text-xs font-semibold"
          >
            <LucideLayers class="text-primary size-3.5" />
            {{ selected.length }} {{ t('properties_grid_units_here') }}
          </p>

          <div class="flex max-h-80 flex-col gap-3 overflow-y-auto p-3">
            <NuxtLinkLocale
              v-for="u in selected"
              :key="u.id"
              :to="{ name: 'property-detail', params: { slug: u.slug } }"
              class="border-border hover:border-primary hover:bg-primary/5 flex h-28 shrink-0 items-stretch overflow-hidden rounded-lg border transition-colors"
            >
              <NuxtImg format="webp" :src="u.image" width="112" height="112" loading="lazy" decoding="async" class="h-full w-28 shrink-0 object-cover" :alt="u.title" />
              <div class="flex min-w-0 flex-1 flex-col p-3">
                <div class="text-primary flex items-center gap-1 text-xs">
                  <LucideMapPin class="size-3 shrink-0" />
                  <span class="line-clamp-1">{{ u.location }}</span>
                </div>
                <p class="text-secondary mt-1 line-clamp-1 text-sm font-semibold">{{ u.title }}</p>
                <div class="text-primary/80 mt-1 flex gap-3 text-xs">
                  <span class="flex items-center gap-1">
                    <LucideBed class="size-3" />
                    {{ u.bedrooms }}
                  </span>
                  <span class="flex items-center gap-1">
                    <LucideBath class="size-3" />
                    {{ u.bathrooms }}
                  </span>
                  <span class="flex items-center gap-1">
                    <LucideScale3D class="size-3" />
                    {{ u.area }} sqm
                  </span>
                </div>
                <div class="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div class="text-primary truncate text-sm font-bold">
                    {{ u.currency }} {{ u.price }}
                    <span v-if="u.pricePeriod" class="text-primary text-xs font-normal">
                      {{ u.pricePeriod }}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    class="text-primary border-primary/30 hover:bg-primary h-7 shrink-0 rounded-md px-3 text-xs hover:text-white"
                  >
                    View
                  </Button>
                </div>
              </div>
            </NuxtLinkLocale>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="view === 'map'" class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
      <button
        v-for="(p, i) in properties"
        :key="i"
        :class="[
          'hover:border-primary flex items-center gap-3 rounded-lg border bg-white p-3 text-start transition-colors',
          selected?.length === 1 && selected[0].title === p.title
            ? 'border-primary border-2'
            : 'border-border',
        ]"
        @click="selected = [p]"
      >
        <NuxtImg format="webp" :src="p.image" width="96" height="72" loading="lazy" decoding="async" class="h-18 w-24 shrink-0 rounded-md object-cover" :alt="p.title" />
        <div class="min-w-0 flex-1">
          <div class="text-primary flex items-center gap-1 text-xs">
            <LucideMapPin class="size-3" />
            {{ p.location }}
          </div>
          <p class="text-secondary mt-0.5 line-clamp-1 text-sm font-semibold">{{ p.title }}</p>
          <p class="text-primary mt-1 text-sm font-bold">JOD {{ p.price }}</p>
        </div>
      </button>
    </div>

    <div v-if="lastPage > 1" class="mt-10 flex items-center justify-center gap-3">
      <button
        class="border-border text-secondary hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-secondary flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition-colors disabled:opacity-40"
        :disabled="page === 1"
        @click="page = Math.max(1, page - 1)"
        :aria-label="t('properties_grid_prev_page')"
      >
        <LucideChevronLeft class="size-4 rtl:rotate-180" />
      </button>
      <template v-for="(p, idx) in pageItems" :key="idx">
        <span
          v-if="p === '…'"
          class="text-secondary/60 flex h-10 w-10 items-center justify-center text-sm"
        >
          …
        </span>
        <button
          v-else
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors',
            page === p
              ? 'bg-primary border-primary border text-white'
              : 'text-secondary/80 border-border hover:border-primary hover:text-primary border bg-transparent',
          ]"
          @click="page = p"
        >
          {{ p }}
        </button>
      </template>
      <button
        class="border-border text-secondary hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-secondary flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition-colors disabled:opacity-40"
        :disabled="page === lastPage"
        @click="page = Math.min(lastPage, page + 1)"
        :aria-label="t('properties_grid_next_page')"
      >
        <LucideChevronRight class="size-4 rtl:rotate-180" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const { t } = useT()
const { mapTags } = useTagNames()
const view = ref('grid')
const selected = ref(null)
const locale = useCookie('locale', { default: () => 'en' })
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

// Page lives in the shared filter state so it survives navigating to a unit and
// back (fixes "back returns to page 1"). Reset to 1 whenever a filter changes.
const page = computed({
  get: () => Number(filters.value.page) || 1,
  set: (v) => { filters.value.page = Math.max(1, Number(v) || 1) },
})

watch(
  () => [
    filters.value.keyword, filters.value.city_id, filters.value.area_id,
    filters.value.property_id, filters.value.unit_type, filters.value.is_for_sale,
    filters.value.is_for_rent, filters.value.bedrooms, filters.value.bathrooms,
    filters.value.min_price, filters.value.max_price, filters.value.tag, filters.value.sort,
  ],
  () => { filters.value.page = 1 },
)

// Scroll back to the top of the results when the page changes. Waits a tick so
// the skeleton has rendered first — scrolling before the list swaps out gets
// cancelled by the re-layout.
const root = ref(null)
watch(page, async () => {
  if (!import.meta.client) return
  await nextTick()
  const top = (root.value?.getBoundingClientRect().top ?? 0) + window.scrollY - 100
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
})

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

const unitsFetch = useFetch('/api/units', {
  query: apiQuery,
  watch: [locale, apiQuery],
  key: computed(() => `units-list-${locale.value}`),
})
const { data: propsRes, status } = unitsFetch
// Awaited on the server so the listing is in the SSR HTML, but never awaited on
// the client: filter and page changes render the skeleton immediately instead of
// freezing the page until the request lands.
if (import.meta.server) await unitsFetch
const pending = computed(() => status.value === 'pending')
// Match the outgoing page size so the grid doesn't jump height while loading.
const skeletonCount = computed(() => properties.value.length || 6)

const transactionTag = (tt) => (tt === 'sale' ? t('properties_filter_sale', 'For Sale') : tt === 'rent' ? t('properties_filter_rent', 'For Rent') : '')
const transactionVariant = (t) => (t === 'sale' ? 'sale' : 'rent')

const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

const properties = computed(() => {
  const items = propsRes.value?.data?.data ?? []
  const mapped = items.map((u) => {
    const lat = u.latitude != null ? Number(u.latitude) : mapCenter.lat
    const lng = u.longitude != null ? Number(u.longitude) : mapCenter.lng
    const tagList = mapTags(u.tags)
    return {
      id: u.id,
      slug: u.slug ?? String(u.id ?? ''),
      image:
        u.cover_image ||
        u.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      tag: transactionTag(u.transaction_type),
      tagVariant: transactionVariant(u.transaction_type),
      tags: tagList,
      statusLabel: '',
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
  // Sorting is done server-side across the full result set (see /api/units).
  return mapped
})

// Never leave the user stuck on an empty map view.
watch(() => properties.value.length, (n) => {
  if (n === 0 && view.value === 'map') view.value = 'grid'
})

// Units sharing the exact same lat/lng (e.g. same building) collapse into a
// single map pin. Clicking it opens a card listing every unit at that point,
// instead of stacking overlapping pins.
const mapGroups = computed(() => {
  const groups = new Map()
  for (const p of properties.value) {
    const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
    if (!groups.has(key)) groups.set(key, { lat: p.lat, lng: p.lng, units: [] })
    groups.get(key).units.push(p)
  }
  return [...groups.values()]
})

const { data: areasLookup } = useFetch('/api/areas', {
  lazy: true,
  watch: [locale],
  key: `chips-areas-${locale.value}`,
})
const { data: typesLookup } = useFetch('/api/units/types', {
  lazy: true,
  watch: [locale],
  key: `chips-types-${locale.value}`,
})
const { data: citiesLookup } = useFetch('/api/cities', {
  lazy: true,
  watch: [locale],
  key: `chips-cities-${locale.value}`,
})
const areaName = (id) =>
  (areasLookup.value?.data ?? []).find((a) => String(a.id) === String(id))?.name || id
const typeName = (v) => (typesLookup.value?.data ?? []).find((ty) => ty.value === v)?.name || v
const cityName = (id) =>
  (citiesLookup.value?.data ?? []).find((c) => String(c.id) === String(id))?.name || id

const activeChips = computed(() => {
  const f = filters.value
  const chips = []
  if (f.keyword)
    chips.push({
      key: 'keyword',
      label: `${t('properties_filters_search_placeholder').replace('...', '')}: ${f.keyword}`,
    })
  if (f.city_id)
    chips.push({
      key: 'city_id',
      label: `${t('properties_filters_all_cities')}: ${cityName(f.city_id)}`,
    })
  if (f.area_id)
    chips.push({
      key: 'area_id',
      label: `${t('properties_filters_all_locations')}: ${areaName(f.area_id)}`,
    })
  if (f.unit_type) chips.push({ key: 'unit_type', label: typeName(f.unit_type) })
  if (f.is_for_sale === '1') chips.push({ key: 'is_for_sale', label: t('properties_filter_sale') })
  if (f.is_for_rent === '1') chips.push({ key: 'is_for_rent', label: t('properties_filter_rent') })
  if (f.bedrooms)
    chips.push({
      key: 'bedrooms',
      label: `${f.bedrooms} ${t('properties_filters_bedrooms_suffix')}`,
    })
  if (f.bathrooms)
    chips.push({ key: 'bathrooms', label: `${f.bathrooms} ${t('property_stats_bathrooms')}` })
  if (f.min_price)
    chips.push({ key: 'min_price', label: `${t('properties_filters_price_min')}: ${f.min_price}` })
  if (f.max_price)
    chips.push({ key: 'max_price', label: `${t('properties_filters_price_max')}: ${f.max_price}` })
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
  Object.keys(filters.value).forEach((k) => {
    if (k !== 'sort') filters.value[k] = ''
  })
  page.value = 1
}

const total = computed(() => propsRes.value?.data?.total ?? properties.value.length)
const lastPage = computed(() => propsRes.value?.data?.last_page ?? 1)
// Windowed page list with first/last always shown and '…' for gaps.
const pageItems = computed(() => {
  const lp = lastPage.value
  const cur = page.value
  if (lp <= 7) return Array.from({ length: lp }, (_, i) => i + 1)

  const items = [1]
  const start = Math.max(2, cur - 1)
  const end = Math.min(lp - 1, cur + 1)
  if (start > 2) items.push('…')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < lp - 1) items.push('…')
  items.push(lp)
  return items
})
</script>
