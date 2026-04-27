<template>
    <div class="bg-white h-max w-full py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="w-full h-max flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p class="text-primary/80 text-sm uppercase">
                        Featured Properties
                    </p>
                    <p class="text-secondary text-2xl md:text-3xl mt-2 font-bold">
                       Handpicked for You
                    </p>
                </div>
                <div class="flex gap-1 items-center justify-between md:justify-end md:items-end">
                    <div class="flex gap-2">
                        <Button
                            @click="onPrev"
                            :disabled="arrivedState.left"
                            variant="outline"
                            class="hover:text-primary hover:bg-white hover:border-primary aspect-square !p-0 rounded-full text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <LucideChevronLeft />
                        </Button>
                        <Button
                            @click="onNext"
                            :disabled="arrivedState.right"
                            variant="outline"
                            class="hover:text-primary hover:bg-white hover:border-primary aspect-square !p-0 rounded-full text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <LucideChevronRight />
                        </Button>
                    </div>
                    <NuxtLink
                        :to="{ name: 'properties' }"
                        class="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                    >
                        View All
                        <LucideChevronRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>
            </div>
            <div class="w-full h-max py-5 mt-5 flex flex-col gap-5 ">
                <div ref="cardsContainer" class="h-95 w-full scrollbar-hide flex snap-x overflow-x-auto flex-nowrap gap-4 md:gap-5">
                    <CardsProperty
                        v-for="(p, i) in properties"
                        :key="i"
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
                        class="w-[calc(100%-16px)] sm:w-[calc(100%/2-12px)] md:w-[calc(100%/3-14px)] lg:w-[calc(100%/4-16px)] snap-center sm:snap-start shrink-0 h-full"
                    />
                </div>
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

            </div>
        </div>
        
    </div>
</template>

<script setup>

import { useScroll, useWindowSize } from '@vueuse/core'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { motion } from 'motion-v'

const properties = [
    { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', tag: 'New', tagVariant: 'new', type: 'Penthouse', location: 'Abdoun', title: 'Penthouse Duplex – Abdoun', bedrooms: 4, bathrooms: 4, area: 380, price: '720,000' },
    { image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', tag: 'New', tagVariant: 'new', type: 'Villa', location: 'Dabouq', title: 'Pool Villa – Dabouq Estates', bedrooms: 5, bathrooms: 4, area: 620, price: '1,150,000' },
    { image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', tag: 'New', tagVariant: 'new', type: 'Apartment', location: 'Shmeisani', title: 'Skyline Apartment – Shmeisani', bedrooms: 3, bathrooms: 2, area: 210, price: '186,000' },
    { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', tag: 'New', tagVariant: 'new', type: 'Apartment', location: 'Deir Ghbar', title: 'Garden Apartment – Deir Ghbar', bedrooms: 3, bathrooms: 2, area: 240, price: '275,000' },
    { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', tag: 'New', tagVariant: 'new', type: 'Villa', location: 'Aqaba', title: 'Sea View Villa – Aqaba', bedrooms: 6, bathrooms: 5, area: 800, price: '1,250,000' },
    { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', tag: 'New', tagVariant: 'new', type: 'Apartment', location: 'Sweifieh', title: 'Family Apartment – Sweifieh', bedrooms: 3, bathrooms: 3, area: 220, price: '215,000' },
    { image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', tag: 'New', tagVariant: 'new', type: 'Townhouse', location: 'Dabouq', title: 'Modern Townhouse – Dabouq', bedrooms: 4, bathrooms: 3, area: 320, price: '395,000' },
    { image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', tag: 'New', tagVariant: 'new', type: 'Studio', location: 'Abdali', title: 'Boulevard Studio – Abdali', bedrooms: 1, bathrooms: 1, area: 70, price: '95,000' },
]
const cardsCount = properties.length
const { width } = useWindowSize()
const visibleCount = computed(() => {
    if (width.value >= 1024) return 4
    if (width.value >= 768) return 3
    if (width.value >= 640) return 2
    return 1
})
const dotsCount = computed(() => Math.max(1, cardsCount - (visibleCount.value - 1)))

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
    return Math.min(dotsCount.value - 1, Math.round(x.value / step))
})

const nextCard = () => {
    const el = cardsContainer.value
    if (!el) return
    if (arrivedState.right) {
        x.value = 0
        return
    }
    x.value = el.scrollLeft + getStep()
}

const prevCard = () => {
    const el = cardsContainer.value
    if (!el) return
    if (arrivedState.left) {
        x.value = el.scrollWidth
        return
    }
    x.value = el.scrollLeft - getStep()
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

onMounted(startInterval)
onBeforeUnmount(() => {
    clearInterval(intervalId)
    clearTimeout(cooldownId)
})

</script>

<style scoped></style>