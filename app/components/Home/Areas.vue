<template>
    <div class="bg-white h-max w-full py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="w-full h-max flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p class="text-primary/80 text-sm uppercase">{{ t('home_areas_eyebrow') }}</p>
                    <p class="text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('home_areas_title') }}</p>
                </div>
                <div class="flex gap-1 items-center justify-between md:justify-end md:items-end">
                    <NuxtLink
                        :to="{ name: 'areas' }"
                        class="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                    >
                        {{ t('common_view_all') }}
                        <LucideChevronRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>
            </div>
            <div class="w-full h-max py-5 mt-2 md:mt-5 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <NuxtLink
                    v-for="area in areas"
                    :key="area.slug"
                    :to="{ name: 'areas', hash: `#${area.slug}` }"
                    class="group aspect-square relative w-full rounded-lg overflow-hidden block"
                >
                    <img
                        :src="area.img"
                        :alt="area.title"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div class="absolute bottom-0 flex flex-col start-0 p-5">
                        <p class="text-white text-lg font-bold">{{ area.title }}</p>
                        <p class="text-white/70 text-sm font-medium">{{ area.tag }}</p>
                        <p class="text-white/70 text-xs mt-4 font-bold">{{ area.count }} {{ t('home_areas_count_suffix') }}</p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { areas as fallbackAreas } from '../Areas/data'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `home-areas-${locale.value}`,
})

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1764562155616-facdda23671a?auto=format&fit=crop&w=1200&q=80'
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const areas = computed(() => {
    const list = areasRes.value?.data ?? []
    if (!list.length) return fallbackAreas.slice(0, 4)
    return list.slice(0, 4).map(a => ({
        slug: slugify(a.name),
        title: a.name,
        tag: a.tag || '',
        count: a.properties_count ?? 0,
        img: a.image || FALLBACK_IMG,
    }))
})
</script>
