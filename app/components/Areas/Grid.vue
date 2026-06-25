<template>
    <section class="pt-12 md:pt-18 pb-0 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <NuxtLink
                    v-for="area in areas"
                    :key="area.id"
                    :to="{ name: 'area-detail', params: { id: area.id } }"
                    class="group aspect-square relative w-full rounded-lg overflow-hidden block cursor-pointer bg-secondary"
                >
                    <img
                        v-if="area.img"
                        :src="area.img"
                        :alt="area.title"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="text-white text-center px-3">
                            <template v-if="area.count > 0">
                                <p class="text-4xl md:text-5xl font-bold leading-none">{{ area.count }}</p>
                                <p class="text-sm md:text-base mt-2 text-white/80">{{ t('home_areas_count_suffix') }}</p>
                            </template>
                            <p v-else class="text-base md:text-lg font-medium">{{ t('home_areas_explore', 'Explore area') }}</p>
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

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `areas-grid-${locale.value}`,
})

const areas = computed(() => {
    const list = areasRes.value?.data ?? []
    return list.slice(0, 4).map(a => ({
        id: a.id,
        title: a.name,
        count: a.properties_count ?? 0,
        img: a.image || '',
    }))
})
</script>
