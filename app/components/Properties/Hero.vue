<template>
    <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
        <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
            <nav class="flex items-center gap-2 text-sm text-white/60">
                <NuxtLink :to="{ name: 'home' }" class="hover:text-white transition-colors">{{ t('nav_home') }}</NuxtLink>
                <LucideChevronRight class="size-3.5 rtl:rotate-180" />
                <span class="text-white">{{ t('nav_properties') }}</span>
            </nav>

            <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-5 max-w-2xl">
                {{ t('properties_hero_title') }}
            </h1>
            <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                {{ t('properties_hero_body') }}
            </p>

            <div class="flex flex-wrap gap-3 mt-6">
                <button
                    v-for="c in chips"
                    :key="c.value"
                    :class="[
                        'px-5 py-2 rounded-full text-sm border transition-all',
                        active === c.value
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-transparent text-white/80 border-white/20 hover:border-brand-cyan-neon hover:text-brand-cyan-neon'
                    ]"
                    @click="setActive(c.value)"
                >
                    {{ c.label }}
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { t } = useT()

const chips = computed(() => [
    { value: 'all', label: t('properties_filter_all') },
    { value: 'sale', label: t('properties_filter_sale') },
    { value: 'rent', label: t('properties_filter_rent') },
])

const route = useRoute()
const router = useRouter()
const active = ref(route.query.type || 'all')

const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', tag: '', sort: 'newest'
}))

const applyToFilters = (v) => {
    if (v === 'sale') {
        filters.value.is_for_sale = '1'
        filters.value.is_for_rent = '0'
    } else if (v === 'rent') {
        filters.value.is_for_sale = '0'
        filters.value.is_for_rent = '1'
    } else {
        filters.value.is_for_sale = ''
        filters.value.is_for_rent = ''
    }
}
applyToFilters(active.value)

watch(() => route.query.type, (v) => {
    active.value = v || 'all'
    applyToFilters(active.value)
})

const setActive = (v) => {
    active.value = v
    applyToFilters(v)
    router.replace({ query: { ...route.query, type: v === 'all' ? undefined : v } })
}
</script>
