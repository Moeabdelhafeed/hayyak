<template>
    <section class="pt-12 md:pt-18 pb-0 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <NuxtLink
                    v-for="area in areas"
                    :key="area.slug"
                    :to="{ name: 'area-detail', params: { slug: area.slug } }"
                    class="group aspect-square relative w-full rounded-lg overflow-hidden block cursor-pointer"
                >
                    <img
                        :src="area.img"
                        :alt="area.title"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="text-white text-center">
                            <p class="text-4xl md:text-5xl font-bold leading-none">{{ area.count }}</p>
                            <p class="text-sm md:text-base mt-2 text-white/80">{{ t('home_areas_count_suffix') }}</p>
                        </div>
                    </div>
                    <div class="absolute bottom-0 start-0 p-5">
                        <p class="text-white text-2xl md:text-3xl underline decoration-brand-cyan-neon decoration-2 underline-offset-8">{{ area.title }}</p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { areas as fallbackAreas } from './data'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `areas-grid-${locale.value}`,
})

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1764562155616-facdda23671a?auto=format&fit=crop&w=1200&q=80'
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const randCount = (seed) => {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    return 20 + (h % 180)
}

const areas = computed(() => {
    const list = areasRes.value?.data ?? []
    if (!list.length) return fallbackAreas.slice(0, 4)
    return list.slice(0, 4).map(a => ({
        slug: slugify(a.name),
        title: a.name,
        count: a.properties_count ?? a.units_count ?? randCount(String(a.id ?? a.name ?? '')),
        img: a.image || FALLBACK_IMG,
    }))
})
</script>
