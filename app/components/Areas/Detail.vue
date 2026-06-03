<template>
    <section class="pt-8 md:pt-10 pb-12 md:pb-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto flex flex-col gap-8 md:gap-10">
            <div
                v-for="area in cards"
                :key="area.id"
                :id="String(area.id)"
                role="link"
                tabindex="0"
                class="group bg-white rounded-lg border border-border hover:border-brand-turquoise/50 hover:shadow-lg transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-2 scroll-mt-32 cursor-pointer"
                @click="goTo(area.id)"
                @keydown.enter="goTo(area.id)"
            >
                <div class="relative h-72 lg:h-auto min-h-[320px] overflow-hidden bg-primary/5">
                    <img v-if="area.img" :src="area.img" :alt="area.title" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>

                <div class="p-6 md:p-8">
                    <div>
                        <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ area.title }}</h2>
                        <p v-if="area.city" class="text-brand-turquoise text-sm mt-1 flex items-center gap-1.5">
                            <LucideMapPin class="size-3.5" />
                            {{ area.city }}
                        </p>
                    </div>

                    <p v-if="area.desc" class="text-brand-turquoise/80 text-sm leading-relaxed mt-4">{{ area.desc }}</p>

                    <div v-if="area.dining.length || area.shopping.length || area.landmarks.length || area.practical" class="border-t border-border mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div v-if="area.dining.length">
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideUtensils class="size-3.5" />
                                {{ t('areas_detail_dining') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.dining" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div v-if="area.shopping.length">
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideShoppingBag class="size-3.5" />
                                {{ t('areas_detail_shopping') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.shopping" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div v-if="area.landmarks.length">
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideLandmark class="size-3.5" />
                                {{ t('areas_detail_landmarks') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.landmarks" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div v-if="area.practical">
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideHouse class="size-3.5" />
                                {{ t('areas_detail_practical') }}
                            </h4>
                            <p class="text-sm text-secondary/90 leading-relaxed mt-3">{{ area.practical }}</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <NuxtLink
                            :to="{ name: 'properties', query: { area_id: area.id } }"
                            class="inline-flex items-center gap-2 text-sm text-brand-turquoise hover:underline"
                            @click.stop
                        >
                            {{ t('areas_detail_view_properties_in') }} {{ area.title }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })
const router = useRouter()

const goTo = (id) => router.push({ name: 'area-detail', params: { id } })

const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `areas-detail-${locale.value}`,
})

const cards = computed(() => {
    const apiList = areasRes.value?.data ?? []
    return apiList
        .filter(a => a?.name)
        .map(api => ({
            id: api.id,
            title: api.name || '',
            city: api.city?.name || '',
            img: api.image || '',
            desc: api.description || api.short_description || '',
            practical: api.practical_info || '',
            dining: api.dining || [],
            shopping: api.shopping || [],
            landmarks: api.landmarks || [],
        }))
})
</script>
