<template>
    <section class="pt-12 md:pt-18 pb-0 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <a
                    v-for="area in areas"
                    :key="area.slug"
                    :href="`#${area.slug}`"
                    class="group relative w-full block h-40 sm:h-48 rounded-lg overflow-hidden cursor-pointer"
                >
                    <img
                        :src="area.img"
                        :alt="area.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors"></div>
                    <div class="absolute bottom-0 start-0 end-0 p-4">
                        <h3 class="font-display text-white text-[15px] font-medium">{{ area.title }}</h3>
                        <p class="text-white/60 text-xs mt-0.5">{{ area.count }} properties</p>
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { areas as fallbackAreas } from './data'

const locale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `areas-grid-${locale.value}`,
})

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1764562155616-facdda23671a?auto=format&fit=crop&w=1200&q=80'
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const areas = computed(() => {
    const list = areasRes.value?.data ?? []
    if (!list.length) return fallbackAreas.slice(0, 4)
    return list.slice(0, 4).map(a => ({
        slug: slugify(a.name),
        title: a.name,
        count: a.properties_count ?? 0,
        img: a.image || FALLBACK_IMG,
    }))
})
</script>
