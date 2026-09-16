<template>
    <div class="bg-white h-max w-full py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="w-full h-max flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p class="text-primary/80 text-sm uppercase">
                        {{ t('home_featured_eyebrow') }}
                    </p>
                    <p class="text-secondary text-2xl md:text-3xl mt-2 font-bold">
                        {{ t('home_featured_title') }}
                    </p>
                </div>
                <div class="flex gap-4 items-center justify-between md:justify-end md:items-center">
                    <div class="flex gap-2">
                        <Button
                            @click="onPrev"
                            :disabled="arrivedState.left"
                            variant="outline"
                            class="hover:text-brand-cyan hover:bg-white hover:border-brand-cyan hover:shadow-[0_0_14px_rgba(85,255,255,0.4)] transition-all aspect-square !p-0 rounded-full text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <LucideChevronLeft class="rtl:rotate-180" />
                        </Button>
                        <Button
                            @click="onNext"
                            :disabled="arrivedState.right"
                            variant="outline"
                            class="hover:text-brand-cyan hover:bg-white hover:border-brand-cyan hover:shadow-[0_0_14px_rgba(85,255,255,0.4)] transition-all aspect-square !p-0 rounded-full text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <LucideChevronRight class="rtl:rotate-180" />
                        </Button>
                    </div>
                    <NuxtLinkLocale
                        :to="{ name: 'properties' }"
                        class="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline whitespace-nowrap"
                    >
                        {{ t('common_view_all') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                </div>
            </div>
            <div class="w-full h-max py-5 mt-5 flex flex-col gap-5 ">
                <div ref="cardsContainer" class="h-95 w-full scrollbar-hide flex snap-x overflow-x-auto flex-nowrap gap-4 md:gap-5">
                    <NuxtLinkLocale
                        v-for="(p, i) in properties"
                        :key="i"
                        :to="{ name: 'property-detail', params: { slug: p.slug || String(p.id || i + 1) } }"
                        class="w-[calc(100%-16px)] sm:w-[calc(100%/2-12px)] md:w-[calc(100%/3-14px)] lg:w-[calc(100%/4-16px)] snap-center sm:snap-start shrink-0 h-full"
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
                            class="h-full"
                        />
                    </NuxtLinkLocale>
                </div>
                <ClientOnly>
                    <div class="w-full h-max flex items-center justify-center gap-2 ">
                        <motion.div
                            v-for="i in dotsCount"
                            :key="i"
                            :animate="{ width: activeIndex === i - 1 ? 32 : 10 }"
                            :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }"
                            :class="[
                                'h-2.5 rounded-full',
                                activeIndex === i - 1 ? 'bg-primary' : 'bg-primary/8'
                            ]"
                        ></motion.div>
                    </div>
                </ClientOnly>

            </div>
        </div>
        
    </div>
</template>

<script setup>

import { useScroll, useWindowSize } from '@vueuse/core'
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { motion } from 'motion-v'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data: unitsRes } = await useFetch('/api/units', {
    query: { featured: true, per_page: 8 },
    watch: [locale],
    key: `home-featured-units-${locale.value}`,
})

const priceOf = (u) => u.sale_price ?? u.market_rent ?? null

const properties = computed(() => {
    const raw = unitsRes.value?.data?.data ?? []
    return raw.map(u => {
        const tags = (u.tags ?? []).map(tg => typeof tg === 'string' ? { name: tg, color: '' } : { name: tg?.name, color: tg?.color || '' }).filter(t => t.name)
        return {
            id: u.id,
            slug: u.slug ?? String(u.id ?? ''),
            image: u.cover_image || u.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            tag: u.transaction_type === 'rent' ? t('properties_filter_rent', 'For Rent') : t('properties_filter_sale', 'For Sale'),
            tagVariant: u.transaction_type === 'rent' ? 'rent' : 'sale',
            tags,
            statusLabel: '',
            type: u.unit_type_name || u.unit_type || '',
            location: u.property?.area || u.property?.city || u.property?.location || '',
            building: u.property?.name || '',
            title: u.name,
            bedrooms: u.bedrooms ?? 0,
            bathrooms: u.bathrooms ?? 0,
            area: u.size_sqft ? Math.round(Number(u.size_sqft)) : 0,
            parking: u.parking ?? 0,
            currency: u.currency || u.property?.price_currency || 'JOD',
            price: priceOf(u) ? Number(priceOf(u)).toLocaleString('en-US') : '—',
            pricePeriod: u.is_for_rent ? '/mo' : '',
        }
    })
})
const cardsCount = computed(() => properties.value.length)
const { width } = useWindowSize()
const visibleCount = computed(() => {
    if (width.value >= 1024) return 4
    if (width.value >= 768) return 3
    if (width.value >= 640) return 2
    return 1
})
const dotsCount = computed(() => Math.max(1, cardsCount.value - (visibleCount.value - 1)))

const cardsContainer = ref(null)
const { x, arrivedState } = useScroll(cardsContainer, { behavior: 'smooth' })

const getStep = () => {
    const el = cardsContainer.value
    if (!el) return 0
    const first = el.firstElementChild
    if (!first) return el.offsetWidth
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || 0)
    return first.offsetWidth + gap
}

const activeIndex = computed(() => {
    const step = getStep()
    if (!step) return 0
    return Math.min(dotsCount.value - 1, Math.round(Math.abs(x.value) / step))
})

const isRtl = () => {
    if (typeof document === 'undefined') return false
    return document.documentElement.dir === 'rtl'
}

const nextCard = () => {
    const el = cardsContainer.value
    if (!el) return
    const step = getStep()
    const rtl = isRtl()
    const atEnd = rtl ? arrivedState.left : arrivedState.right
    if (atEnd) {
        x.value = rtl ? -el.scrollWidth : 0
        return
    }
    x.value = el.scrollLeft + (rtl ? -step : step)
}

const prevCard = () => {
    const el = cardsContainer.value
    if (!el) return
    const step = getStep()
    const rtl = isRtl()
    const atStart = rtl ? arrivedState.right : arrivedState.left
    if (atStart) {
        x.value = rtl ? 0 : el.scrollWidth
        return
    }
    x.value = el.scrollLeft - (rtl ? -step : step)
}

const AUTO_MS = 4000
const COOLDOWN_MS = 5000
let intervalId
let cooldownId

const startInterval = () => {
    clearInterval(intervalId)
    intervalId = setInterval(nextCard, AUTO_MS)
}

const cooldown = () => {
    clearInterval(intervalId)
    clearTimeout(cooldownId)
    cooldownId = setTimeout(startInterval, COOLDOWN_MS)
}

const onPrev = () => { prevCard(); cooldown() }
const onNext = () => { nextCard(); cooldown() }

onMounted(() => {
    // Always begin on the first card.
    nextTick(() => {
        const el = cardsContainer.value
        if (el) el.scrollLeft = isRtl() ? el.scrollWidth : 0
    })
    startInterval()
})
onBeforeUnmount(() => {
    clearInterval(intervalId)
    clearTimeout(cooldownId)
})

</script>

<style scoped></style>