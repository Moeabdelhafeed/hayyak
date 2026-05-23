<template>
    <div>
        <div class="font-bg h-max md:h-[100svh] w-full relative">
            <div class="relative md:absolute md:inset-0 h-full w-full flex items-center  justify-center max-w-[1350px] mx-auto px-4 py-20 md:py-0">
                <div class="flex w-full md:mt-20  flex-col items-center z-10">
                    <motion.div
                        class="text-center text-white w-full md:w-[60%]"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
                    >
                        <h1 class="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            <span class="block">{{ t('home_hero_title') }}</span>
                            <span class="block text-brand-cyan-neon mt-2">{{ t('home_hero_title_accent') }}</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        class="text-white text-center mt-6 md:mt-10 w-full md:w-[60%] text-base md:text-lg font-light"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }"
                    >
                        {{ t('home_hero_subtitle') }}
                    </motion.p>

                    <motion.div
                        class="w-full md:w-[80%] h-max bg-background mt-8 md:mt-15 p-4 md:p-6 rounded-lg"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }"
                    >
                        <div class="w-full gap-2 h-full flex flex-wrap">
                            <Button
                                v-for="tab in tabs"
                                :key="tab.key"
                                size="lg"
                                :class="[
                                    'rounded-full transition-all',
                                    activeTab === tab.key
                                        ? 'bg-brand-orange text-white hover:bg-brand-orange/90'
                                        : 'text-secondary/70 bg-transparent hover:text-secondary hover:bg-primary/8'
                                ]"
                                @click="activeTab = tab.key"
                            >
                                {{ tab.label }}
                            </Button>
                        </div>
                        <hr class="mt-4 !border-secondary/10">
                        <div class="flex flex-col md:flex-row py-4 gap-3">
                            <Select v-model="searchArea">
                                <SelectTrigger
                                    class="w-full md:flex-1 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none">
                                    <div class="flex items-center gap-3">
                                        <LucideMapPin class="text-primary" />
                                        <SelectValue :placeholder="t('home_hero_location_placeholder')" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="a in areaOptions" :key="a.id" :value="String(a.id)">{{ a.name }}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select v-model="searchType">
                                <SelectTrigger
                                    class="w-full md:flex-1 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none">
                                    <div class="flex items-center gap-3">
                                        <LucideBuilding2 class="text-primary" />
                                        <SelectValue :placeholder="t('home_hero_type_placeholder')" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="o in typeOptions" :key="o.value" :value="o.value">{{ o.label }}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input v-model="searchKeyword" :placeholder="t('home_hero_keyword_placeholder')" class="w-full md:flex-1 placeholder:text-primary/80 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none" />

                            <div class="flex gap-3 w-full md:w-auto">
                                <Button size="lg" class="flex-1 md:flex-none py-5.5 md:aspect-square rounded-lg bg-primary/10 text-primary border hover:bg-primary/20"> <LucideFilter /></Button>
                                <Button size="lg" class="flex-1 md:flex-none py-5.5 md:!aspect-square rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors" @click="onSearch"> <LucideSearch /></Button>
                            </div>

                        </div>
                        <hr class=" !border-secondary/10">
                        <div class="flex flex-col md:flex-row mt-4 gap-2 md:gap-6 text-sm">
                            <div class="text-secondary/50">
                                {{ t('home_hero_popular_label') }}
                            </div>
                            <div class="flex flex-wrap gap-3 md:gap-6">
                                <div class="text-primary underline">{{ t('home_hero_popular_1') }}</div>
                                <div class="text-primary underline">{{ t('home_hero_popular_2') }}</div>
                                <div class="text-primary underline">{{ t('home_hero_popular_3') }}</div>
                            </div>
                        </div>
                    </motion.div>

                    <div class="w-full flex flex-wrap items-center justify-center gap-y-6 mt-10 md:mt-14">
                        <template v-for="(s, i) in stats" :key="s.label">
                            <motion.div
                                class="flex items-center gap-4 px-6 sm:px-10 lg:px-14"
                                :initial="{ opacity: 0, y: 28 }"
                                :animate="{ opacity: 1, y: 0 }"
                                :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.15 }"
                            >
                                <div class="size-12 sm:size-14 rounded-full border-2 border-brand-cyan-neon flex items-center justify-center shrink-0">
                                    <component :is="s.icon" class="size-5 sm:size-6 text-brand-cyan-neon" />
                                </div>
                                <div class="text-white text-start">
                                    <p class="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-md leading-none">
                                        <DefaultCountUp :to="s.value" :suffix="s.suffix" />
                                    </p>
                                    <p class="text-sm sm:text-base mt-1 text-white/70">{{ s.label }}</p>
                                </div>
                            </motion.div>
                            <div v-if="i < stats.length - 1" class="hidden md:block w-px h-10 bg-white/20"></div>
                        </template>
                    </div>

                </div>
            </div>

            <img src="/images/hero.gif" alt="" class="w-full h-full object-cover absolute inset-0">
            <div class="absolute bg-gradient-to-b from-black/70 via-black/20 to-black/70 inset-0 z-0"></div>


        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { LucideAward, LucideBuilding2 as StatBuilding, LucideUsers } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue';
import Input from '../ui/input/Input.vue';

const { t } = useT()

const tabs = computed(() => [
    { key: 'Buy', label: t('home_hero_tab_buy') },
    { key: 'Rent', label: t('home_hero_tab_rent') },
    { key: 'Commercial', label: t('home_hero_tab_commercial') },
    { key: 'Industrial', label: t('home_hero_tab_industrial') },
])
const activeTab = ref('Buy')

const locale = useCookie('locale', { default: () => 'en' })
const router = useRouter()
const filters = useState('property-filters', () => ({
    keyword: '', city_id: '', area_id: '', unit_type: '',
    is_for_sale: '', is_for_rent: '',
    bedrooms: '', bathrooms: '', min_price: '', max_price: '', sort: 'newest'
}))

const searchArea = ref('')
const searchType = ref('')
const searchKeyword = ref('')

const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `hero-areas-${locale.value}`,
})
const areaOptions = computed(() => areasRes.value?.data ?? [])

const { data: typesRes } = await useFetch('/api/units/types', {
    watch: [locale],
    key: `hero-unit-types-${locale.value}`,
})
const typeOptions = computed(() => {
    const list = typesRes.value?.data ?? []
    return list.map(ty => ({ value: ty.value, label: ty.name }))
})

const onSearch = () => {
    let sale = ''
    let rent = ''
    if (activeTab.value === 'Buy') { sale = '1'; rent = '0' }
    else if (activeTab.value === 'Rent') { sale = '0'; rent = '1' }
    filters.value = {
        ...filters.value,
        area_id: searchArea.value || '',
        unit_type: searchType.value || '',
        keyword: searchKeyword.value || '',
        is_for_sale: sale,
        is_for_rent: rent,
    }
    router.push({ name: 'properties' })
}

const stats = computed(() => [
    { value: 15, suffix: '+', label: t('home_hero_stat_experience'), icon: LucideAward },
    { value: 200, suffix: '+', label: t('home_hero_stat_sold'), icon: StatBuilding },
    { value: 98, suffix: '%', label: t('home_hero_stat_satisfaction'), icon: LucideUsers },
])
</script>

<style scoped></style>