<template>
    <div class="bg-white h-max w-full py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="w-full h-max flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p class="text-primary/80 text-sm uppercase">{{ t('home_areas_eyebrow') }}</p>
                    <p class="text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('home_areas_title') }}</p>
                </div>
                <div class="flex gap-1 items-center justify-between md:justify-end md:items-end">
                    <NuxtLinkLocale
                        :to="{ name: 'areas' }"
                        class="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                    >
                        {{ t('common_view_all') }}
                        <LucideChevronRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                </div>
            </div>
            <div class="w-full h-max py-5 mt-2 md:mt-5 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <NuxtLinkLocale
                    v-for="area in areas"
                    :key="area.id"
                    :to="{ name: 'area-detail', params: { slug: area.slug } }"
                    class="group aspect-square relative w-full rounded-lg overflow-hidden block bg-secondary"
                >
                    <NuxtImg
                        v-if="area.img"
                        :src="area.img"
                        :alt="area.title"
                        loading="lazy"
                        decoding="async"
                        sizes="sm:100vw md:50vw lg:25vw"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <div class="text-white text-center px-3">
                            <template v-if="area.count > 0">
                                <p class="text-4xl md:text-5xl font-bold leading-none">{{ area.count }}</p>
                                <p class="text-sm md:text-base mt-2 text-white/80">{{ t('home_areas_count_suffix') }}</p>
                            </template>
                            <p v-else class="text-base md:text-lg font-medium">{{ t('home_areas_explore', 'Explore area') }}</p>
                        </div>
                    </div>
                    <div class="absolute bottom-0 start-0 p-5">
                        <p class="text-white text-2xl md:text-3xl  underline decoration-brand-cyan-neon decoration-2 underline-offset-8">{{ area.title }}</p>
                    </div>
                </NuxtLinkLocale>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `home-areas-${locale.value}`,
})

const areas = computed(() => {
    const list = areasRes.value?.data ?? []
    return list.slice(0, 4).map(a => ({
        id: a.id,
        slug: a.slug ?? String(a.id ?? ''),
        title: a.name,
        count: a.properties_count ?? 0,
        img: a.image || '',
    }))
})
</script>
