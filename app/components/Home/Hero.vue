<template>
  <div>
    <div class="font-bg relative h-max w-full md:h-[100svh]">
      <div
        class="relative mx-auto flex h-full w-full max-w-[1350px] items-center justify-center px-4 py-20 md:absolute md:inset-0 md:py-0"
      >
        <div class="z-10 flex w-full flex-col items-center md:mt-20">
          <motion.div
            v-if="heroTitle || heroAccent"
            class="w-full text-center text-white md:w-[60%]"
            :initial="{ opacity: 0, y: 28 }"
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
            v-if="heroSubtitle"
            class="mt-5 w-full text-center text-base font-light text-white md:mt-8 md:w-[60%] md:text-lg"
            :initial="{ opacity: 0, y: 28 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }"
          >
            {{ heroSubtitle }}
          </motion.p>

          <motion.div
            class="bg-background mt-8 h-max w-full rounded-lg p-4 md:mt-15 md:w-[80%] md:p-6"
            :initial="{ opacity: 0, y: 28 }"
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

      <img
        v-if="mediaType === 'image'"
        :src="mediaImage"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
      />
      <video
        v-else
        :src="mediaVideo"
        :poster="mediaImage || undefined"
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
const { home } = useHome()

const hero = computed(() => home.value.hero ?? {})
const heroTitle = computed(() => hero.value.title || '')
const heroAccent = computed(() => hero.value.title_accent || '')
const heroSubtitle = computed(() => hero.value.subtitle || '')
const mediaType = computed(() => hero.value.media_type || 'video')
const mediaVideo = computed(() => hero.value.video_url || '/videos/hero.mp4')
const mediaImage = computed(() => hero.value.image_url || '')

const tabs = computed(() => [
  { key: 'Buy', label: t('home_hero_tab_buy') },
  { key: 'Rent', label: t('home_hero_tab_rent') },
])
const activeTab = ref('Buy')

const locale = useCookie('locale', { default: () => 'en' })
const byName = (key) => (a, b) =>
  String(a?.[key] ?? '').localeCompare(String(b?.[key] ?? ''), locale.value, { sensitivity: 'base' })
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
}))

const searchCity = ref('')
const searchArea = ref('')
const searchType = ref('')
const searchKeyword = ref('')
const searchBedrooms = ref('')
const searchBathrooms = ref('')
const searchMinPrice = ref('')
const searchMaxPrice = ref('')
const searchTag = ref('')
const searchSort = ref('')
const showFilters = ref(false)
const bedroomOptions = ['1', '2', '3', '4', '5', '6']
const bathroomOptions = ['1', '2', '3', '4', '5', '6']

const { data: areasRes } = await useFetch('/api/areas', {
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

const { data: typesRes } = await useFetch('/api/units/types', {
  watch: [locale],
  key: `hero-unit-types-${locale.value}`,
})
const typeOptions = computed(() => {
  const list = typesRes.value?.data ?? []
  return list.map((ty) => ({ value: ty.value, label: ty.name })).sort(byName('label'))
})

const { data: citiesRes } = await useFetch('/api/cities', {
  watch: [locale],
  key: `hero-cities-${locale.value}`,
})
const cityOptions = computed(() => [...(citiesRes.value?.data ?? [])].sort(byName('name')))

const { data: tagsRes } = await useFetch('/api/tags', {
  watch: [locale],
  key: `hero-tags-${locale.value}`,
})
const tagOptions = computed(() => [...(tagsRes.value?.data ?? [])].sort(byName('name')))

const onSearch = () => {
  let sale = ''
  let rent = ''
  if (activeTab.value === 'Buy') {
    sale = '1'
    rent = '0'
  } else if (activeTab.value === 'Rent') {
    sale = '0'
    rent = '1'
  }
  filters.value = {
    ...filters.value,
    city_id: searchCity.value || '',
    area_id: searchArea.value || '',
    property_id: '',
    unit_type: searchType.value || '',
    keyword: searchKeyword.value || '',
    is_for_sale: sale,
    is_for_rent: rent,
    bedrooms: searchBedrooms.value || '',
    bathrooms: searchBathrooms.value || '',
    min_price: searchMinPrice.value || '',
    max_price: searchMaxPrice.value || '',
    tag: searchTag.value || '',
    sort: searchSort.value || 'newest',
  }
  router.push({ name: 'properties' })
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
