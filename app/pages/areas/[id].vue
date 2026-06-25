<template>
    <div v-if="area">
        <section class="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
            <div class="absolute inset-0 bg-secondary">
                <img v-if="area.img" :src="area.img" :alt="area.title" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/40 to-transparent"></div>
            </div>
            <div class="grid-bg absolute inset-0 pointer-events-none"></div>
            <div class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10 pb-16 w-full">
                <NuxtLink
                    :to="{ name: 'areas' }"
                    class="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors"
                >
                    <LucideArrowRight class="size-4 rtl:rotate-180 rotate-180 rtl:rotate-0" />
                    {{ t('area_detail_back') }}
                </NuxtLink>
                <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.2em] mb-3">{{ t('area_detail_eyebrow') }}</p>
                <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-3">{{ area.title }}</h1>
                <p v-if="area.tag" class="text-white/70 text-lg sm:text-xl italic">{{ area.tag }}</p>
                <p v-else-if="area.city" class="text-white/70 text-lg sm:text-xl flex items-center gap-1.5">
                    <LucideMapPin class="size-4" />
                    {{ area.city }}
                </p>
            </div>
        </section>

        <section v-if="stats.length" class="bg-secondary py-6 border-y border-white/5">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
                    <div v-for="s in stats" :key="s.label" class="text-center px-4">
                        <component :is="s.icon" class="size-5 text-brand-cyan-neon mx-auto mb-1" />
                        <p class="text-white text-xl font-semibold">{{ s.value }}</p>
                        <p class="text-white/50 text-xs mt-1">{{ s.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="area.desc || hasHighlights" class="py-16 sm:py-20 bg-white">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div v-if="area.desc">
                        <p class="text-brand-turquoise text-xs uppercase tracking-[0.15em] mb-3 font-medium">{{ t('area_detail_about_label') }}</p>
                        <h2 class="font-display text-secondary text-2xl sm:text-3xl font-bold mb-6">{{ t('area_detail_about_title') }} {{ area.title }}</h2>
                        <p class="text-brand-turquoise leading-relaxed text-[15px]">{{ area.desc }}</p>
                        <p v-if="area.practical" class="text-brand-turquoise/80 leading-relaxed text-sm mt-4">{{ area.practical }}</p>
                    </div>
                    <div v-if="hasHighlights" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div
                            v-for="h in highlights"
                            :key="h.title"
                            class="group bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-xl p-5 hover:bg-brand-turquoise/10 hover:border-brand-turquoise/40 transition-colors"
                        >
                            <div class="flex items-center gap-2 mb-3">
                                <div class="size-8 rounded-md bg-brand-turquoise/10 group-hover:bg-brand-turquoise flex items-center justify-center transition-colors">
                                    <component :is="h.icon" class="size-4 text-brand-turquoise group-hover:text-white transition-colors" />
                                </div>
                                <h3 class="text-sm font-semibold text-secondary">{{ h.title }}</h3>
                            </div>
                            <ul class="space-y-1.5">
                                <li v-for="item in h.items" :key="item" class="text-xs text-brand-turquoise/80 flex items-start gap-1.5">
                                    <span class="text-brand-turquoise mt-0.5 text-[10px]">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 sm:py-20 bg-[#f8fafb]">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10">
                <div class="flex justify-between items-end mb-10">
                    <div>
                        <p class="text-brand-turquoise text-xs uppercase tracking-[0.15em] mb-2 font-medium">{{ t('area_detail_properties_eyebrow') }}</p>
                        <h2 class="font-display text-secondary text-2xl sm:text-3xl font-bold">{{ t('area_detail_properties_title') }} {{ area.title }}</h2>
                    </div>
                    <NuxtLink
                        :to="{ name: 'properties' }"
                        @click="applyAreaFilter"
                        class="text-brand-turquoise text-sm inline-flex items-center gap-1.5 hover:underline"
                    >
                        {{ t('area_detail_view_all') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>
                <div v-if="properties.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NuxtLink
                        v-for="p in properties"
                        :key="p.id"
                        :to="{ name: 'property-detail', params: { id: p.id } }"
                    >
                        <CardsProperty
                            :image="p.image"
                            :tag="p.tag"
                            :tag-variant="p.tagVariant"
                            :tags="p.tags"
                            :status-label="p.statusLabel"
                            :type="p.type"
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
                            class="h-full"
                        />
                    </NuxtLink>
                </div>
                <div v-else class="text-center py-12 text-brand-turquoise/70 text-sm">
                    {{ t('area_detail_no_properties') }}
                </div>
            </div>
        </section>

        <DefaultFadeIn>
            <DefaultCta
                :title="`${t('areas_detail_view_properties_in')} ${area.title}`"
                :primary-label="t('common_contact_us')"
                :secondary-label="t('nav_properties')"
                :secondary-to="{ name: 'properties' }"
            />
        </DefaultFadeIn>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideTrendingUp, LucideBuilding2, LucideMaximize2, LucideHouse, LucideHeart, LucideShoppingBag } from 'lucide-vue-next'

definePageMeta({ name: 'area-detail' })

const { t } = useT()
const route = useRoute()
const locale = useCookie('locale', { default: () => 'en' })

const { data: areaRes } = await useFetch(`/api/areas/${route.params.id}`, {
    watch: [locale],
    key: computed(() => `area-detail-${route.params.id}-${locale.value}`),
})

const area = computed(() => {
    const a = areaRes.value?.data
    if (!a) return null
    return {
        id: a.id,
        title: a.name || '',
        city: a.city?.name || '',
        tag: a.tagline || '',
        desc: a.description || a.short_description || '',
        practical: a.practical_info || '',
        dining: a.dining || [],
        shopping: a.shopping || [],
        landmarks: a.landmarks || [],
        img: a.image || '',
    }
})

// rent → For Rent; sale or both → For Sale
const transactionTag = (tt) => tt === 'rent' ? 'For Rent' : 'For Sale'
const transactionVariant = (tt) => tt === 'rent' ? 'rent' : 'sale'
const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

// Units are embedded in the area detail response
const rawUnits = computed(() => areaRes.value?.data?.units ?? [])

const properties = computed(() => rawUnits.value.slice(0, 6).map(u => {
    const tagList = (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(t => t.name)
    return {
        id: u.id,
        image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
        tag: transactionTag(u.transaction_type),
        tagVariant: transactionVariant(u.transaction_type),
        tags: tagList,
        statusLabel: (u.status && u.status !== 'Vacant') ? u.status : '',
        type: u.unit_type_name || u.unit_type || '',
        location: u.property?.location || area.value?.title || '',
        building: u.property?.name || '',
        title: u.name,
        bedrooms: u.bedrooms ?? 0,
        bathrooms: u.bathrooms ?? 0,
        area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
        parking: u.parking ?? 0,
        currency: u.currency || u.property?.price_currency || 'JOD',
        price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
        pricePeriod: u.transaction_type === 'rent' ? '/mo' : '',
    }
}))

// Stats are precomputed server-side on the area response.
// Only stats with a real (non-zero) value are shown.
const stats = computed(() => {
    const a = areaRes.value?.data
    const fmt = (n) => Number(n).toLocaleString('en-US')
    const avgPrice = a?.avg_sale_price || a?.avg_rent_price || 0
    const listings = a?.properties_count ?? rawUnits.value.length
    const avgSize = a?.avg_size || 0
    return [
        avgPrice && { label: t('area_detail_stat_avg_price'), value: `JOD ${fmt(avgPrice)}`, icon: LucideTrendingUp },
        listings && { label: t('area_detail_stat_listings'), value: `${listings}+`, icon: LucideBuilding2 },
        avgSize && { label: t('area_detail_stat_avg_size'), value: `${fmt(Math.round(avgSize))} sqm`, icon: LucideMaximize2 },
    ].filter(Boolean)
})

const highlights = computed(() => [
    area.value?.dining?.length && { title: t('area_detail_highlights_healthcare'), icon: LucideHeart, items: area.value.dining.slice(0, 3) },
    area.value?.shopping?.length && { title: t('area_detail_highlights_shopping'), icon: LucideShoppingBag, items: area.value.shopping.slice(0, 3) },
    area.value?.landmarks?.length && { title: t('area_detail_highlights_schools'), icon: LucideHouse, items: area.value.landmarks.slice(0, 3) },
].filter(Boolean))

const hasHighlights = computed(() => highlights.value.length > 0)

const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', tag: '', sort: 'newest'
}))

const applyAreaFilter = () => {
    filters.value = { ...filters.value, area_id: String(route.params.id) }
}

useSeoMeta({
    title: computed(() => `${area.value?.title || 'Area'} - Hayyak`),
    description: computed(() => area.value?.desc),
})
</script>

<style scoped>
.grid-bg {
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 90%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 90%);
}
</style>
