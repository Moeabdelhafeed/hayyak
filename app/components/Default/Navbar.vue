<template>
    <div class="fixed top-0 left-0 right-0 z-50 w-full">
        <div :class="['h-10 w-full transition-colors duration-200 hidden md:block', transparent ? 'bg-transparent' : 'bg-secondary']">
            <div dir="ltr" class="flex justify-between items-center max-w-[1350px] px-4 mx-auto">
                <div class="flex h-10 items-center text-white/80">
                    <a v-if="settings.app_phone" :href="`tel:${phoneDigits}`" dir="ltr" class="flex gap-2 items-center hover:text-white transition-colors">
                        <LucidePhone class="size-3.5" />
                        <span class="text-sm">{{ settings.app_phone }}</span>
                    </a>
                    <div v-if="settings.app_phone && settings.app_email" class="mx-5 h-[40%] !w-[0.5px] bg-white/30"></div>
                    <a v-if="settings.app_email" :href="`mailto:${settings.app_email}`" class="text-sm hover:text-white transition-colors">{{ settings.app_email }}</a>
                </div>

                <div class="flex h-10 items-center text-white/60">
                    <p v-if="settings.working_hours" class="text-sm">{{ settings.working_hours }}</p>
                    <div v-if="settings.working_hours" class="mx-5 h-[40%] !w-[0.5px] bg-white/30"></div>
                    <template v-if="languages.length >= 2 && languages.length < 3">
                        <button
                            v-if="nextLang"
                            type="button"
                            class="flex gap-2 items-center text-white/90 hover:text-white transition-colors cursor-pointer"
                            @click="toggle"
                        >
                            <img v-if="nextLang.flag" :src="nextLang.flag" :alt="langLabel(nextLang)" class="size-3.5 rounded-sm object-cover">
                            <LucideGlobe v-else class="size-3.5" />
                            <span class="text-sm">{{ langLabel(nextLang) }}</span>
                        </button>
                    </template>
                    <div
                        v-else-if="languages.length >= 3"
                        class="relative flex gap-2 items-center text-white/90"
                        @mouseenter="langMenuOpen = true"
                        @mouseleave="langMenuOpen = false"
                    >
                        <img v-if="currentLang?.flag" :src="currentLang.flag" :alt="langLabel(currentLang)" class="size-3.5 rounded-sm object-cover">
                        <LucideGlobe v-else class="size-3.5" />
                        <span class="text-sm cursor-pointer">{{ langLabel(currentLang) || 'Language' }}</span>
                        <div v-if="langMenuOpen" class="absolute top-full end-0 pt-2 w-[180px] z-50">
                            <div class="bg-white rounded-lg shadow-lg border border-border overflow-hidden py-1">
                                <button
                                    v-for="l in languages"
                                    :key="l.id"
                                    type="button"
                                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:bg-primary/5 transition-colors"
                                    @click="setLocale(l.locale)"
                                >
                                    <img v-if="l.flag" :src="l.flag" :alt="langLabel(l)" class="size-4 rounded-sm object-cover">
                                    <span>{{ langLabel(l) }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="['h-18 w-full transition-colors duration-200', transparent ? 'bg-transparent' : 'bg-secondary shadow-sm']">
            <div class="relative flex justify-between items-center max-w-[1350px] px-4 mx-auto h-full">
                <NuxtLink :to="{ name: 'home' }" class="flex items-center h-full" aria-label="Home">
                    <img :src="logoSrc" class="h-[60%] brightness-0 invert transition-all duration-200" alt="Hayyak">
                </NuxtLink>

                <div class="w-[60%] translate-x-1/2 right-1/2 hidden md:flex items-center justify-center h-full absolute gap-4">
                    <template v-for="link in links" :key="link.label">
                        <div
                            v-if="link.menu"
                            class="relative h-[60%] flex items-center"
                            @mouseenter="openMenu = link.label"
                            @mouseleave="openMenu = null"
                        >
                            <NuxtLink
                                :to="link.to"
                                :class="[
                                    'h-full px-3 text-sm flex items-center gap-1.5 transition-all cursor-pointer',
                                    isActive(link.match)
                                        ? 'border-b-2 border-brand-cyan text-white'
                                        : 'text-white/80 hover:text-white'
                                ]"
                            >
                                {{ link.label }}
                                <LucideChevronDown :class="['size-3.5 transition-transform', openMenu === link.label ? 'rotate-180' : '']" />
                            </NuxtLink>

                            <Transition
                                enter-active-class="transition duration-150 ease-out"
                                leave-active-class="transition duration-100 ease-in"
                                enter-from-class="opacity-0 translate-y-1"
                                leave-to-class="opacity-0 translate-y-1"
                            >
                                <div
                                    v-if="openMenu === link.label"
                                    class="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[300px]"
                                >
                                    <div class="bg-white rounded-lg shadow-lg border border-border max-h-[70vh] overflow-y-auto py-2">
                                        <NuxtLink
                                            v-for="item in link.menu"
                                            :key="item.label"
                                            :to="item.to"
                                            class="flex items-start gap-3 px-4 py-3 hover:bg-primary/5 transition-colors group"
                                        >
                                            <div class="size-9 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                                <ServicesIcon :icon="item.icon" :alt="item.label" class="size-4 text-primary" />
                                            </div>
                                            <div class="min-w-0">
                                                <p class="text-secondary text-sm font-semibold group-hover:text-primary transition-colors">{{ item.label }}</p>
                                                <p class="text-primary/70 text-xs mt-0.5">{{ item.desc }}</p>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <NuxtLink
                            v-else
                            :to="link.to"
                            :class="[
                                'h-[60%] px-3 text-sm flex items-center transition-all cursor-pointer',
                                isActive(link.match)
                                    ? 'border-b-2 border-brand-cyan text-white'
                                    : 'text-white/80 hover:text-white'
                            ]"
                        >
                            {{ link.label }}
                        </NuxtLink>
                    </template>
                </div>

                <div class="hidden md:flex items-center gap-3 h-full">
                    <NuxtLink
                        :to="{ name: 'favourites' }"
                        :aria-label="t('nav_favourites', 'Favourites')"
                        :class="[
                            'relative flex items-center justify-center size-10 rounded-md transition-colors duration-200',
                            isActive('/favourites') ? 'bg-white/10' : 'hover:bg-white/10'
                        ]"
                    >
                        <LucideHeart
                            class="size-5 transition-colors"
                            :class="favCount ? 'fill-brand-orange text-brand-orange' : 'text-white/90'"
                        />
                        <span
                            v-if="favCount"
                            class="absolute -top-1 -end-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-brand-orange text-white text-[10px] font-bold leading-none"
                        >{{ favCount }}</span>
                    </NuxtLink>
                    <NuxtLink
                        :to="{ name: 'contact', query: { tab: 'list-property' }, hash: '#enquiry' }"
                        :class="[
                            'px-6 py-2.5 rounded-md transition-colors duration-300 text-sm font-medium border-2',
                            transparent
                                ? 'border-brand-orange text-white hover:bg-brand-orange hover:border-brand-orange'
                                : 'border-brand-orange bg-brand-orange text-white hover:bg-brand-orange/90'
                        ]"
                    >
                        {{ t('nav_list_your_property') }}
                    </NuxtLink>
                </div>

                <div class="md:hidden flex items-center gap-3">
                    <NuxtLink
                        :to="{ name: 'favourites' }"
                        :aria-label="t('nav_favourites', 'Favourites')"
                        class="relative flex items-center justify-center"
                    >
                        <LucideHeart
                            class="size-6"
                            :class="favCount ? 'fill-brand-orange text-brand-orange' : 'text-white'"
                        />
                        <span
                            v-if="favCount"
                            class="absolute -top-1.5 -end-1.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-brand-orange text-white text-[10px] font-bold leading-none"
                        >{{ favCount }}</span>
                    </NuxtLink>
                    <button
                        v-if="languages.length >= 2 && languages.length < 3 && nextLang"
                        type="button"
                        class="flex items-center gap-1.5"
                        @click="toggle"
                        :aria-label="`Switch to ${langLabel(nextLang)}`"
                    >
                        <img v-if="nextLang.flag" :src="nextLang.flag" :alt="langLabel(nextLang)" class="size-5 rounded-sm object-cover">
                        <LucideGlobe v-else class="size-5.5 text-white" />
                    </button>
                    <LucideGlobe v-else class="size-5.5 text-white" />
                    <button
                        class="flex items-center justify-center p-2"
                        @click="mobileOpen = true"
                        aria-label="Open menu"
                    >
                        <LucideMenu class="size-7 text-white" />
                    </button>
                </div>
            </div>
        </div>

        <Transition
            enter-active-class="transition-transform duration-300 ease-out"
            leave-active-class="transition-transform duration-300 ease-in"
            enter-from-class="-translate-y-full"
            leave-to-class="-translate-y-full"
        >
            <div
                v-if="mobileOpen"
                class="md:hidden fixed inset-x-0 top-0 bg-white z-[60] shadow-lg max-h-screen overflow-y-auto"
            >
                <div class="flex items-center justify-between px-4 h-18 border-b border-secondary/10">
                    <NuxtLink :to="{ name: 'home' }" @click="mobileOpen = false" aria-label="Home">
                        <img :src="logoSrc" class="h-[50%]" alt="Hayyak">
                    </NuxtLink>
                    <button @click="mobileOpen = false" aria-label="Close menu">
                        <LucideX class="size-6 text-secondary" />
                    </button>
                </div>
                <nav class="flex flex-col p-4 gap-1">
                    <template v-for="link in links" :key="link.label">
                        <div v-if="link.menu" class="flex flex-col">
                            <button
                                class="flex items-center justify-between px-4 py-3 rounded-md text-base text-secondary hover:bg-primary/5 transition-colors"
                                @click="mobileSubOpen[link.label] = !mobileSubOpen[link.label]"
                            >
                                {{ link.label }}
                                <LucideChevronDown :class="['size-4 transition-transform', mobileSubOpen[link.label] ? 'rotate-180' : '']" />
                            </button>
                            <div v-if="mobileSubOpen[link.label]" class="ms-3 mt-1 flex flex-col gap-1 border-s border-border ps-3 max-h-[50vh] overflow-y-auto">
                                <NuxtLink
                                    v-for="item in link.menu"
                                    :key="item.label"
                                    :to="item.to"
                                    @click="mobileOpen = false"
                                    class="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-primary/5 transition-colors"
                                >
                                    <div class="size-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                        <ServicesIcon :icon="item.icon" :alt="item.label" class="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p class="text-secondary text-sm font-semibold">{{ item.label }}</p>
                                        <p class="text-primary/70 text-xs mt-0.5">{{ item.desc }}</p>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>
                        <NuxtLink
                            v-else
                            :to="link.to"
                            @click="mobileOpen = false"
                            :class="[
                                'px-4 py-3 rounded-md text-base transition-colors',
                                isActive(link.match)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-secondary hover:bg-primary/5'
                            ]"
                        >
                            {{ link.label }}
                        </NuxtLink>
                    </template>
                    <NuxtLink
                        :to="{ name: 'favourites' }"
                        @click="mobileOpen = false"
                        :class="[
                            'flex items-center justify-between px-4 py-3 rounded-md text-base transition-colors',
                            isActive('/favourites') ? 'bg-primary/10 text-primary font-medium' : 'text-secondary hover:bg-primary/5'
                        ]"
                    >
                        <span class="flex items-center gap-2">
                            <LucideHeart class="size-5" :class="favCount ? 'fill-brand-orange text-brand-orange' : ''" />
                            {{ t('nav_favourites', 'Favourites') }}
                        </span>
                        <span
                            v-if="favCount"
                            class="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold"
                        >{{ favCount }}</span>
                    </NuxtLink>
                </nav>
                <div class="p-4 pt-2">
                    <NuxtLink
                        :to="{ name: 'contact', query: { tab: 'list-property' }, hash: '#enquiry' }"
                        @click="mobileOpen = false"
                        class="block w-full text-center px-6 py-3 rounded-md bg-brand-orange text-white font-medium hover:bg-brand-orange/90 transition-colors"
                    >
                        {{ t('nav_list_your_property') }}
                    </NuxtLink>
                    <a v-if="settings.app_phone" :href="`tel:${phoneDigits}`" class="flex items-center gap-2 mt-4 text-primary">
                        <LucidePhone class="size-4" />
                        <p class="text-sm" dir="ltr">{{ settings.app_phone }}</p>
                    </a>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { LucideHome, LucideKey, LucideMapPin, LucideHeart } from 'lucide-vue-next'

const servicesData = useServices()

const navLocale = useCookie('locale', { default: () => 'en' })
const { data: areasRes } = await useFetch('/api/areas', {
    watch: [navLocale],
    key: computed(() => `nav-areas-${navLocale.value}`),
})
const areasData = computed(() =>
    [...(areasRes.value?.data ?? [])].sort((a, b) =>
        String(a?.name ?? '').localeCompare(String(b?.name ?? ''), navLocale.value, { sensitivity: 'base' }),
    ),
)

const { y } = useWindowScroll()
const transparent = computed(() => y.value < 10)

const mobileOpen = ref(false)
const mobileSubOpen = ref({})
const openMenu = ref(null)
const langMenuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { mobileOpen.value = false })

const { languages, currentLang, setLocale, toggle } = useLanguages()
const logoSrc = computed(() => {
    const ar = currentLang.value?.locale === 'ar'
    return (ar ? settings.value.logo_ar : settings.value.logo_en) || (ar ? '/images/logo-ar.png' : '/images/logo.png')
})

const todayLabel = computed(() => {
    const code = currentLang.value?.locale || 'en'
    return new Date().toLocaleDateString(code, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
const nextLang = computed(() => {
    if (languages.value.length < 2) return null
    const idx = languages.value.findIndex(l => l.locale === currentLang.value?.locale)
    return languages.value[(idx + 1) % languages.value.length]
})

// Always show each language in its own native name (autonym), regardless of active locale
const LANG_NATIVE = { en: 'English', ar: 'العربية' }
const langLabel = (l) => (l ? (LANG_NATIVE[l.locale] || l.name || '') : '')

const { t } = useT()
const { settings, phoneDigits } = useSettings()
const { count: favCount } = useFavourites()

const links = computed(() => [
    { label: t('nav_home'), to: { name: 'home' }, match: '/' },
    { label: t('nav_about'), to: { name: 'about' }, match: '/about' },
    {
        label: t('nav_properties'),
        to: { name: 'properties' },
        match: '/properties',
        menu: [
            { label: t('nav_properties_for_sale'), desc: t('nav_properties_for_sale_desc'), to: { name: 'properties', query: { type: 'sale' } }, icon: LucideHome },
            { label: t('nav_properties_for_rent'), desc: t('nav_properties_for_rent_desc'), to: { name: 'properties', query: { type: 'rent' } }, icon: LucideKey },
        ],
    },
    {
        label: t('nav_services'),
        to: { name: 'services' },
        match: '/services',
        menu: servicesData.value.map((s) => ({
            label: s.title,
            desc: s.short,
            to: { name: 'service-detail', params: { id: s.id } },
            icon: s.icon,
        })),
    },
    {
        label: t('nav_areas'),
        to: { name: 'areas' },
        match: '/areas',
        menu: areasData.value.map((a) => ({
            label: a.name,
            desc: a.city?.name || '',
            to: { name: 'area-detail', params: { id: a.id } },
            icon: LucideMapPin,
        })),
    },
    { label: t('nav_insights'), to: { name: 'insights' }, match: '/insights' },
    { label: t('nav_contact'), to: { name: 'contact' }, match: '/contact' },
])

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>

<style></style>
