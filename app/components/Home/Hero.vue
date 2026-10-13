<template>
  <div>
    <!-- Full screen on phones too, not just desktop: `min-h` rather than `h` so the
         hero still grows if the CMS adds stats and the content outgrows the viewport.
         svh, not vh, so the mobile browser's collapsing URL bar doesn't crop it. -->
    <div class="font-bg relative w-full min-h-[100svh] md:h-[100svh]">
      <div
        class="relative mx-auto flex min-h-[100svh] w-full max-w-[1350px] items-center justify-center px-4 pt-24 pb-12 md:absolute md:inset-0 md:h-full md:min-h-0 md:py-0"
      >
        <div class="z-10 flex w-full flex-col items-center md:mt-20">
          <motion.div
            class="w-full text-center text-white md:w-[60%]"
            :initial="false"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
          >
            <h1
              class="font-display text-3xl leading-tight sm:text-5xl"
            >
              <span v-if="heroTitle">{{ heroTitle }}</span>
              <span v-if="heroAccent" class="text-brand-cyan-neon">{{ heroTitle ? ' ' : '' }}{{ heroAccent }}</span>
            </h1>
          </motion.div>
          <motion.p
            class="mt-5 w-full text-center text-base font-light text-white md:mt-8 md:w-[60%] md:text-lg"
            :initial="false"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }"
          >
            {{ heroSubtitle }}
          </motion.p>

          <motion.div
            class="bg-background mt-8 h-max w-full rounded-lg p-4 md:mt-15 md:w-[80%] md:p-6"
            :initial="false"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }"
          >
            <div class="flex h-full w-full flex-wrap gap-2">
              <Button
                v-for="tab in tabs"
                :key="tab.key"
                size="lg"
                :class="[
                  'rounded-full transition-all',
                  activeTab === tab.key
                    ? 'bg-brand-orange hover:bg-brand-orange/90 text-white'
                    : 'text-secondary/70 hover:text-secondary hover:bg-primary/8 bg-transparent',
                ]"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </Button>
            </div>
            <hr class="!border-secondary/10 mt-4" />
            <div class="flex flex-col gap-3 pt-4 md:flex-row">
              <Select v-model="searchCity">
                <SelectTrigger
                  :aria-label="t('properties_filters_all_cities')"
                  class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0 md:flex-1"
                >
                  <div class="flex items-center gap-3">
                    <LucideBuilding class="text-primary size-4" />
                    <SelectValue :placeholder="t('properties_filters_all_cities')" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in cityOptions" :key="c.id" :value="String(c.id)">
                    {{ c.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="searchArea">
                <SelectTrigger
                  :aria-label="t('home_hero_location_placeholder')"
                  class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0 md:flex-1"
                >
                  <div class="flex items-center gap-3">
                    <LucideMapPin class="text-primary size-4" />
                    <SelectValue :placeholder="t('home_hero_location_placeholder')" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="a in areaOptions" :key="a.id" :value="String(a.id)">
                    {{ a.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="searchType">
                <SelectTrigger
                  :aria-label="t('home_hero_type_placeholder')"
                  class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0 md:flex-1"
                >
                  <div class="flex items-center gap-3">
                    <LucideBuilding2 class="text-primary size-4" />
                    <SelectValue :placeholder="t('home_hero_type_placeholder')" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="o in typeOptions" :key="o.value" :value="o.value">
                    {{ o.label }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                v-model="searchKeyword"
                :placeholder="t('home_hero_keyword_placeholder')"
                class="placeholder:text-primary/80 bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0 md:flex-1"
              />

              <div class="flex w-full gap-3 md:w-auto">
                <Button
                  size="lg"
                  :aria-label="t('a11y_filters_button', 'Show more filters')"
                  :aria-expanded="showFilters"
                  :class="[
                    'flex-1 rounded-lg border py-5.5 transition-colors md:aspect-square md:flex-none',
                    showFilters
                      ? 'bg-brand-orange hover:bg-brand-orange/90 border-transparent text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary/20',
                  ]"
                  @click="showFilters = !showFilters"
                >
                  <LucideFilter />
                </Button>
                <Button
                  size="lg"
                  :aria-label="t('a11y_search_button', 'Search properties')"
                  class="bg-brand-orange hover:bg-brand-orange/90 flex-1 rounded-lg py-5.5 text-white transition-colors md:!aspect-square md:flex-none"
                  @click="onSearch"
                >
                  <LucideSearch />
                </Button>
              </div>
            </div>
            <div v-if="showFilters" class="pt-3 pb-2">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
                <Select v-model="searchBedrooms">
                  <SelectTrigger
                  :aria-label="t('properties_filters_any_bedrooms')"
                    class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0"
                  >
                    <div class="flex items-center gap-3">
                      <LucideBed class="text-primary size-4" />
                      <SelectValue :placeholder="t('properties_filters_any_bedrooms')" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="n in bedroomOptions" :key="n" :value="n">
                      {{ n }} {{ t('properties_filters_bedrooms_suffix') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select v-model="searchBathrooms">
                  <SelectTrigger
                  :aria-label="t('properties_filters_any_bathrooms')"
                    class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0"
                  >
                    <div class="flex items-center gap-3">
                      <LucideBath class="text-primary size-4" />
                      <SelectValue :placeholder="t('properties_filters_any_bathrooms')" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="n in bathroomOptions" :key="n" :value="n">
                      {{ n }} {{ t('properties_filters_bathrooms_suffix') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select v-model="searchTag">
                  <SelectTrigger
                  :aria-label="t('properties_filters_all_tags')"
                    class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0"
                  >
                    <div class="flex items-center gap-3">
                      <LucideTag class="text-primary size-4" />
                      <SelectValue :placeholder="t('properties_filters_all_tags')" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="tg in tagOptions" :key="tg.id ?? tg.name" :value="tg.name">
                      {{ tg.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-model="searchMinPrice"
                  type="number"
                  :placeholder="`${t('properties_filters_price_label')} - ${t('properties_filters_price_min')}`"
                  class="bg-primary/7 placeholder:text-primary/80 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0"
                />
                <Input
                  v-model="searchMaxPrice"
                  type="number"
                  :placeholder="`${t('properties_filters_price_label')} - ${t('properties_filters_price_max')}`"
                  class="bg-primary/7 placeholder:text-primary/80 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0"
                />
                <Select v-model="searchSort">
                  <SelectTrigger
                  :aria-label="t('properties_filters_sort_newest')"
                    class="bg-primary/7 w-full rounded-lg !border-0 py-5.5 !shadow-none !ring-0 !ring-offset-0 md:col-span-2"
                  >
                    <div class="flex items-center gap-3">
                      <LucideArrowDownUp class="text-primary size-4" />
                      <SelectValue :placeholder="t('properties_filters_sort_newest')" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {{ t('properties_filters_sort_newest') }}
                    </SelectItem>
                    <SelectItem value="price-asc">
                      {{ t('properties_filters_sort_price_asc') }}
                    </SelectItem>
                    <SelectItem value="price-desc">
                      {{ t('properties_filters_sort_price_desc') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <div
            v-if="stats.length"
            class="mt-10 flex w-full flex-wrap items-center justify-center gap-y-6 md:mt-14"
          >
            <template v-for="(s, i) in stats" :key="s.label">
              <motion.div
                class="flex items-center gap-4 px-6 sm:px-10 lg:px-14"
                :initial="{ opacity: 0, y: 28 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.15 }"
              >
                <div
                  class="border-brand-cyan-neon flex size-12 shrink-0 items-center justify-center rounded-full border-2 sm:size-14"
                >
                  <ServicesIcon
                    :icon="s.icon"
                    :alt="s.label"
                    class="text-brand-cyan-neon size-5 sm:size-6"
                  />
                </div>
                <div class="text-start text-white">
                  <p class="text-2xl leading-none font-bold drop-shadow-md sm:text-3xl lg:text-4xl">
                    <DefaultCountUp :to="s.value" :suffix="s.suffix" />
                  </p>
                  <p class="mt-1 text-sm text-white/70 sm:text-base">{{ s.label }}</p>
                </div>
              </motion.div>
              <div v-if="i < stats.length - 1" class="hidden h-10 w-px bg-white/20 md:block"></div>
            </template>
          </div>
        </div>
      </div>

      <!-- Hero is the CMS video only, by request, so the video is the LCP element and
           LCP is however long its first frame takes: 8.5MB today, measured 3.9s on
           mobile against a 2.5s threshold. Deferring the load was tried and measured
           worse (8.2s) — a full-bleed video is an LCP candidate whenever it paints, so
           delay only moves LCP later. The two levers are both CMS-side: set the hero's
           `image_url` (it becomes `poster`, and a ~100KB still paints in place of the
           video) or upload a smaller encode. See BACKEND_SEO_REQUEST.md. -->
      <video
        v-if="mediaVideo"
        :key="mediaVideo"
        :src="mediaVideo"
        :poster="mediaImage || undefined"
        preload="metadata"
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 h-full w-full object-cover"
      ></video>
      <div
        class="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { motion } from 'motion-v'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'

const { t } = useT()
const { home, ready: homeReady, request: homeRequest } = useHome()
// Awaited on the server so the CMS hero copy and media URL are in the SSR HTML
// rather than arriving on hydration.
if (import.meta.server) await homeRequest

const hero = computed(() => home.value.hero ?? {})
// Fall back to the bundled copy: an empty CMS response must never delete the
// page's only <h1> or leave the hero blank for a crawler.
const heroTitle = computed(() => hero.value.title || t('home_hero_title'))
const heroAccent = computed(() => hero.value.title_accent || t('home_hero_title_accent'))
const heroSubtitle = computed(() => hero.value.subtitle || t('home_hero_subtitle'))
const mediaType = computed(() => hero.value.media_type || 'video')
// CMS-only: no bundled fallback. The local copy was a 3.9MB file shipped in every
// build for a case that does not happen — the CMS always supplies video_url, and when
// it doesn't the poster alone is the right hero.
const mediaVideo = computed(() => hero.value.video_url || '')
const mediaImage = computed(() => hero.value.image_url || '')

const tabs = computed(() => [
  { key: 'Buy', label: t('home_hero_tab_buy') },
  { key: 'Rent', label: t('home_hero_tab_rent') },
])

const locale = useCookie('locale', { default: () => 'en' })
const byName = (key) => (a, b) =>
  String(a?.[key] ?? '').localeCompare(String(b?.[key] ?? ''), locale.value, { sensitivity: 'base' })
const router = useRouter()
const localePath = useLocalePath()
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
}))

// Bind directly to the shared `property-filters` state so the hero and the
// units page filters stay in sync (same source of truth).
const bind = (k) => computed({ get: () => filters.value[k], set: (v) => (filters.value[k] = v) })
const searchCity = bind('city_id')
const searchArea = bind('area_id')
const searchType = bind('unit_type')
const searchKeyword = bind('keyword')
const searchBedrooms = bind('bedrooms')
const searchBathrooms = bind('bathrooms')
const searchMinPrice = bind('min_price')
const searchMaxPrice = bind('max_price')
const searchTag = bind('tag')
const searchSort = bind('sort')

const activeTab = computed({
  get: () => (filters.value.is_for_rent === '1' ? 'Rent' : 'Buy'),
  set: (v) => {
    filters.value.is_for_sale = v === 'Rent' ? '0' : '1'
    filters.value.is_for_rent = v === 'Rent' ? '1' : '0'
  },
})

const showFilters = ref(false)
const bedroomOptions = ['1', '2', '3', '4', '5', '6']
const bathroomOptions = ['1', '2', '3', '4', '5', '6']

const { data: areasRes } = useFetch('/api/areas', {
  // Client-only: these fill Select popovers that are closed on load, so nothing
  // visible or crawlable waits on them — but awaited, they put four CMS round-trips
  // in front of every homepage render.
  server: false,
  watch: [locale],
  key: `hero-areas-${locale.value}`,
})
const allAreas = computed(() => areasRes.value?.data ?? [])
const areaOptions = computed(() => {
  const cid = searchCity.value
  const list = cid
    ? allAreas.value.filter((a) => String(a.city?.id ?? a.city_id) === String(cid))
    : allAreas.value
  return [...list].sort(byName('name'))
})

watch(searchCity, (cid) => {
  if (!cid) return
  const valid = allAreas.value.some(
    (a) =>
      String(a.id) === String(searchArea.value) && String(a.city?.id ?? a.city_id) === String(cid),
  )
  if (!valid) searchArea.value = ''
})

const { data: typesRes } = useFetch('/api/units/types', {
  server: false, // client-only, see the areas fetch above
  watch: [locale],
  key: `hero-unit-types-${locale.value}`,
})
const typeOptions = computed(() => {
  const list = typesRes.value?.data ?? []
  return list.map((ty) => ({ value: ty.value, label: ty.name })).sort(byName('label'))
})

const { data: citiesRes } = useFetch('/api/cities', {
  server: false, // client-only, see the areas fetch above
  watch: [locale],
  key: `hero-cities-${locale.value}`,
})
const cityOptions = computed(() => [...(citiesRes.value?.data ?? [])].sort(byName('name')))

const { data: tagsRes } = useFetch('/api/tags', {
  server: false, // client-only, see the areas fetch above
  watch: [locale],
  key: `hero-tags-${locale.value}`,
})
const tagOptions = computed(() => [...(tagsRes.value?.data ?? [])].sort(byName('name')))

const onSearch = () => {
  // filters are already bound to the shared state; just normalise the
  // sale/rent flags from the active tab and jump to the units page.
  filters.value.is_for_sale = activeTab.value === 'Rent' ? '0' : '1'
  filters.value.is_for_rent = activeTab.value === 'Rent' ? '1' : '0'
  if (!filters.value.sort) filters.value.sort = 'newest'
  router.push(localePath({ name: 'properties' }))
}

const stats = computed(() =>
  (hero.value.stats ?? []).map((s) => ({
    value: Number(s.value) || 0,
    suffix: s.suffix || '',
    label: s.label || '',
    icon: s.icon || '',
  })),
)
</script>

<style scoped></style>
