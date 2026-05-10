<template>
    <section class="relative bg-secondary py-20 md:py-28 overflow-hidden">
        <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
            <nav class="flex items-center gap-2 text-sm text-white/60">
                <NuxtLink :to="{ name: 'home' }" class="hover:text-white transition-colors">Home</NuxtLink>
                <LucideChevronRight class="size-3.5 rtl:rotate-180" />
                <span class="text-white">Properties</span>
            </nav>

            <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-5 max-w-2xl">
                All Properties
            </h1>
            <p class="text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
                Discover our curated portfolio of residential and commercial properties across Jordan's most sought-after locations.
            </p>

            <div class="flex flex-wrap gap-3 mt-6">
                <button
                    v-for="c in chips"
                    :key="c.value"
                    :class="[
                        'px-5 py-2 rounded-full text-sm border transition-colors',
                        active === c.value
                            ? 'bg-white text-secondary border-white'
                            : 'bg-transparent text-white/80 border-white/20 hover:border-white/60 hover:text-white'
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
import { ref, watch } from 'vue'

const chips = [
    { value: 'all', label: 'All' },
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
]

const route = useRoute()
const router = useRouter()
const active = ref(route.query.type || 'all')

watch(() => route.query.type, (v) => {
    active.value = v || 'all'
})

const setActive = (v) => {
    active.value = v
    router.replace({ query: { ...route.query, type: v === 'all' ? undefined : v } })
}
</script>
