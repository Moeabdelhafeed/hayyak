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

        <div class="mt-3 relative">
            <LucideMapPin class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="areaId">
                <SelectTrigger :class="triggerClass">
                    <SelectValue :placeholder="t('properties_filters_all_locations')" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="a in areaOptions" :key="a.id" :value="String(a.id)">{{ a.name }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3 relative">
            <LucideBuilding2 class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="propertyType">
                <SelectTrigger :class="triggerClass">
                    <SelectValue :placeholder="t('properties_filters_all_types')" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="o in types" :key="o.value" :value="o.value">{{ o.label }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3 relative">
            <LucideBed class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="bedrooms">
                <SelectTrigger :class="triggerClass">
                    <SelectValue :placeholder="t('properties_filters_any_bedrooms')" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="n in bedroomOptions" :key="n" :value="n">{{ n }} {{ t('properties_filters_bedrooms_suffix') }}</SelectItem>
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

        <div class="mt-5 relative">
            <LucideArrowDownUp class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="sort">
                <SelectTrigger :class="triggerClass">
                    <SelectValue :placeholder="t('properties_filters_sort_newest')" />
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
import { computed } from 'vue'

const triggerClass = 'w-full ps-9 pe-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary data-[placeholder]:text-secondary'
const inputClass = 'w-full ps-9 pe-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const priceInputClass = 'w-full px-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', sort: 'newest'
}))

const bind = (k) => computed({ get: () => filters.value[k], set: (v) => (filters.value[k] = v) })
const search = bind('keyword')
const areaId = bind('area_id')
const propertyType = bind('unit_type')
const bedrooms = bind('bedrooms')
const priceMin = bind('min_price')
const priceMax = bind('max_price')
const sort = bind('sort')

const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `filter-areas-${locale.value}`,
})
const areaOptions = computed(() => areasRes.value?.data ?? [])

const { data: typesRes } = await useFetch('/api/units/types', {
    watch: [locale],
    key: `filter-unit-types-${locale.value}`,
})
const types = computed(() => {
    const list = typesRes.value?.data ?? []
    return list.map(ty => ({ value: ty.value, label: ty.name }))
})

const bedroomOptions = ['1', '2', '3', '4', '5', '6']
</script>
