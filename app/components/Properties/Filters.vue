<template>
    <aside class="bg-white border border-border rounded-lg p-5 lg:sticky lg:top-33 h-max">
        <h3 class="font-display text-secondary text-lg font-bold">{{ t('properties_filters_title') }}</h3>

        <div class="mt-5 relative">
            <LucideSearch class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Input
                v-model="search"
                :placeholder="t('properties_filters_search_placeholder')"
                :class="inputClass"
            />
        </div>

        <div class="mt-3">
            <Select v-model="cityId">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideBuilding class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_all_cities')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="c in cityOptions" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3">
            <Select v-model="areaId">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideMapPin class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_all_locations')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="a in areaOptions" :key="a.id" :value="String(a.id)">{{ a.name }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3">
            <Select v-model="propertyType">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideBuilding2 class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_all_types')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="o in types" :key="o.value" :value="o.value">{{ o.label }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3">
            <Select v-model="bedrooms">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideBed class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_any_bedrooms')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="n in bedroomOptions" :key="n" :value="n">{{ n }} {{ t('properties_filters_bedrooms_suffix') }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3">
            <Select v-model="bathrooms">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideBath class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_any_bathrooms')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="n in bathroomOptions" :key="n" :value="n">{{ n }} {{ t('properties_filters_bathrooms_suffix') }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-5">
            <p class="text-xs uppercase tracking-[0.15em] text-primary font-medium">{{ t('properties_filters_price_label') }}</p>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <Input
                    v-model="priceMin"
                    type="number"
                    :placeholder="t('properties_filters_price_min')"
                    :class="priceInputClass"
                />
                <Input
                    v-model="priceMax"
                    type="number"
                    :placeholder="t('properties_filters_price_max')"
                    :class="priceInputClass"
                />
            </div>
        </div>

        <div class="mt-3">
            <Select v-model="tag">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideTag class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_all_tags')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="tg in tagOptions" :key="tg.id ?? tg.name" :value="tg.name">{{ tg.name }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-5">
            <Select v-model="sort">
                <SelectTrigger :class="triggerClass">
                    <div class="flex items-center gap-3">
                        <LucideArrowDownUp class="text-primary size-4 shrink-0" />
                        <SelectValue :placeholder="t('properties_filters_sort_newest')" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">{{ t('properties_filters_sort_newest') }}</SelectItem>
                    <SelectItem value="price-asc">{{ t('properties_filters_sort_price_asc') }}</SelectItem>
                    <SelectItem value="price-desc">{{ t('properties_filters_sort_price_desc') }}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const triggerClass = 'w-full px-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary data-[placeholder]:text-secondary'
const inputClass = 'w-full ps-9 pe-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const priceInputClass = 'w-full px-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', property_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', tag: '', sort: 'newest'
}))

const byName = (key) => (a, b) =>
    String(a?.[key] ?? '').localeCompare(String(b?.[key] ?? ''), locale.value, { sensitivity: 'base' })

const bind = (k) => computed({ get: () => filters.value[k], set: (v) => (filters.value[k] = v) })

// Free-text fields write through a local ref on a debounce. Bound straight to the
// shared state they fired one API request and one router.replace() per keystroke,
// which is what let the URL and the input race each other apart.
const debouncedBind = (k, ms = 350) => {
    const local = ref(filters.value[k])
    // Keep in step when something else clears the field (a chip, "clear all").
    watch(() => filters.value[k], (v) => { if (v !== local.value) local.value = v })
    watchDebounced(local, (v) => { filters.value[k] = v }, { debounce: ms })
    return local
}

const search = debouncedBind('keyword')
const cityId = bind('city_id')
const areaId = bind('area_id')
const propertyType = bind('unit_type')
const bedrooms = bind('bedrooms')
const bathrooms = bind('bathrooms')
const priceMin = debouncedBind('min_price')
const priceMax = debouncedBind('max_price')
const tag = bind('tag')
const sort = bind('sort')

const { data: areasRes } = useFetch('/api/areas', {
    lazy: true,
    watch: [locale],
    key: `filter-areas-${locale.value}`,
})
const allAreas = computed(() => areasRes.value?.data ?? [])
const areaOptions = computed(() => {
    const cid = filters.value.city_id
    const list = cid
        ? allAreas.value.filter(a => String(a.city?.id ?? a.city_id) === String(cid))
        : allAreas.value
    return [...list].sort(byName('name'))
})

watch(() => filters.value.city_id, (cid) => {
    if (!cid) return
    const valid = allAreas.value.some(a => String(a.id) === String(filters.value.area_id) && String(a.city?.id ?? a.city_id) === String(cid))
    if (!valid) filters.value.area_id = ''
})

const { data: typesRes } = useFetch('/api/units/types', {
    lazy: true,
    watch: [locale],
    key: `filter-unit-types-${locale.value}`,
})
const types = computed(() => {
    const list = typesRes.value?.data ?? []
    return list.map(ty => ({ value: ty.value, label: ty.name })).sort(byName('label'))
})

const { data: tagsRes } = useFetch('/api/tags', {
    lazy: true,
    watch: [locale],
    key: `filter-tags-${locale.value}`,
})
const tagOptions = computed(() => [...(tagsRes.value?.data ?? [])].sort(byName('name')))

const { data: citiesRes } = useFetch('/api/cities', {
    lazy: true,
    watch: [locale],
    key: `filter-cities-${locale.value}`,
})
const cityOptions = computed(() => [...(citiesRes.value?.data ?? [])].sort(byName('name')))

const bedroomOptions = ['1', '2', '3', '4', '5', '6']
const bathroomOptions = ['1', '2', '3', '4', '5', '6']
</script>
