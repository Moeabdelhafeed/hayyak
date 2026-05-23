<template>
    <div v-if="area">
        <section class="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
            <div class="absolute inset-0">
                <img :src="area.img" :alt="area.title" class="w-full h-full object-cover">
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
                <p class="text-white/70 text-lg sm:text-xl italic">{{ area.tag }}</p>
            </div>
        </section>

        <section class="bg-secondary py-6 border-y border-white/5">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
                    <div class="text-center px-4">
                        <LucideTrendingUp class="size-5 text-brand-cyan-neon mx-auto mb-1" />
                        <p class="text-white text-xl font-semibold">{{ stats.avgPrice }}</p>
                        <p class="text-white/50 text-xs mt-1">{{ t('area_detail_stat_avg_price') }}</p>
                    </div>
                    <div class="text-center px-4">
                        <LucideBuilding2 class="size-5 text-brand-cyan-neon mx-auto mb-1" />
                        <p class="text-white text-xl font-semibold">{{ stats.listings }}+</p>
                        <p class="text-white/50 text-xs mt-1">{{ t('area_detail_stat_listings') }}</p>
                    </div>
                    <div class="text-center px-4">
                        <LucideMaximize2 class="size-5 text-brand-cyan-neon mx-auto mb-1" />
                        <p class="text-white text-xl font-semibold">{{ stats.avgSize }}</p>
                        <p class="text-white/50 text-xs mt-1">{{ t('area_detail_stat_avg_size') }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 sm:py-20 bg-white">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <p class="text-brand-turquoise text-xs uppercase tracking-[0.15em] mb-3 font-medium">{{ t('area_detail_about_label') }}</p>
                        <h2 class="font-display text-secondary text-2xl sm:text-3xl font-bold mb-6">{{ t('area_detail_about_title') }} {{ area.title }}</h2>
                        <p class="text-brand-turquoise leading-relaxed text-[15px]">{{ area.desc }}</p>
                        <p v-if="area.practical" class="text-brand-turquoise/80 leading-relaxed text-sm mt-4">{{ area.practical }}</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            :type="p.type"
                            :location="p.location"
                            :title="p.title"
                            :bedrooms="p.bedrooms"
                            :bathrooms="p.bathrooms"
                            :area="p.area"
                            :price="p.price"
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
import { areas as fallbackAreas } from '../../components/Areas/data'

definePageMeta({ name: 'area-detail' })

const { t } = useT()
const route = useRoute()
const locale = useCookie('locale', { default: () => 'en' })

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1764562155616-facdda23671a?auto=format&fit=crop&w=1600&q=80'
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `area-detail-areas-${locale.value}`,
})

const apiArea = computed(() => {
    const list = areasRes.value?.data ?? []
    return list.find(a => slugify(a.name) === route.params.slug)
})

const fallback = computed(() => fallbackAreas.find(a => a.slug === route.params.slug) || fallbackAreas[0])

const area = computed(() => {
    const api = apiArea.value
    const fb = fallback.value
    if (!api && !fb) return null
    return {
        id: api?.id ?? null,
        slug: route.params.slug,
        title: api?.name || fb?.title || '',
        tag: fb?.tag || '',
        desc: fb?.desc || '',
        practical: fb?.practical || '',
        dining: fb?.dining || [],
        shopping: fb?.shopping || [],
        landmarks: fb?.landmarks || [],
        img: api?.image || fb?.img || FALLBACK_IMG,
    }
})

const { data: unitsRes } = await useFetch('/api/units', {
    query: computed(() => ({ area_id: apiArea.value?.id, per_page: 6 })),
    watch: [locale, () => apiArea.value?.id],
    key: 'area-units',
})

const transactionTag = (tt) => tt === 'sale' ? 'For Sale' : tt === 'rent' ? 'For Rent' : ''
const transactionVariant = (tt) => tt === 'sale' ? 'sale' : 'rent'
const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

const rawUnits = computed(() => unitsRes.value?.data?.data ?? [])

const properties = computed(() => rawUnits.value.slice(0, 6).map(u => ({
    id: u.id,
    image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
    tag: transactionTag(u.transaction_type),
    tagVariant: transactionVariant(u.transaction_type),
    type: u.unit_type_name || u.unit_type || '',
    location: u.property?.area || u.property?.city || area.value?.title || '',
    title: u.name,
    bedrooms: u.bedrooms ?? 0,
    bathrooms: u.bathrooms ?? 0,
    area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
    price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
})))

const stats = computed(() => {
    const units = rawUnits.value
    const prices = units.map(u => Number(priceOf(u))).filter(n => n > 0)
    const sizes = units.map(u => Number(u.size_sqft)).filter(n => n > 0)
    const avg = (arr) => arr.length ? Math.round(arr.reduce((s, n) => s + n, 0) / arr.length) : 0
    const fmt = (n) => n ? n.toLocaleString('en-US') : '—'
    const total = unitsRes.value?.data?.total ?? unitsRes.value?.data?.meta?.total ?? units.length
    return {
        avgPrice: prices.length ? `JOD ${fmt(avg(prices))}` : '—',
        listings: total || 0,
        avgSize: sizes.length ? `${fmt(avg(sizes))} sqm` : '—',
    }
})

const highlights = computed(() => [
    { title: t('area_detail_highlights_schools'), icon: LucideHouse, items: area.value?.shopping?.slice(0, 3) || [] },
    { title: t('area_detail_highlights_healthcare'), icon: LucideHeart, items: area.value?.dining?.slice(0, 3) || [] },
    { title: t('area_detail_highlights_shopping'), icon: LucideShoppingBag, items: area.value?.landmarks?.slice(0, 3) || [] },
])

const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', sort: 'newest'
}))

const applyAreaFilter = () => {
    if (apiArea.value?.id) {
        filters.value = { ...filters.value, area_id: String(apiArea.value.id) }
    }
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
