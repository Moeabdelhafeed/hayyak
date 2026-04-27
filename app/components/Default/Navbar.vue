<template>
    <div class="fixed top-0 left-0 right-0 z-50 w-full">
        <div :class="['h-10 w-full transition-colors duration-200 hidden md:block', transparent ? 'bg-transparent' : 'bg-secondary']">
            <div class="flex justify-between items-center max-w-[1350px] px-4 mx-auto">
                <div class="w-max text-white/80 flex h-10 items-center">
                    <div class="flex gap-2 items-center">
                        <LucidePhone class="size-3.5" />
                        <p class="text-sm font-bold">+962 7 9999 9999</p>
                    </div>
                    <div class="mx-6 h-[40%] !w-[0.5px] bg-white/30"></div>
                    <div class="flex gap-2 items-center">
                        <p class="text-sm font-bold">email@gmail.com</p>
                    </div>
                </div>

                <div class="w-max text-white/60 flex h-10 items-center">
                    <div class="flex gap-2 items-center">
                        <p class="text-sm font-bold">{{ new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                    </div>
                    <div class="mx-6 h-[40%] !w-[0.5px] bg-white/30"></div>
                    <div class="flex gap-2 items-center text-white/90">
                        <LucideGlobe class="size-3.5" />
                        <p class="text-sm font-bold">العربية</p>
                    </div>
                </div>
            </div>
        </div>
        <div :class="['h-18 w-full transition-colors duration-200', transparent ? 'bg-transparent' : 'bg-white shadow-sm']">
            <div class="relative flex justify-between items-center max-w-[1350px] px-4 mx-auto h-full">
                <div class="flex items-center h-full">
                    <img src="/images/logo.png" :class="['h-[50%] transition-all duration-200', transparent ? 'brightness-0 invert' : '']" alt="">
                </div>

                <div class="w-[60%] translate-x-1/2 right-1/2 hidden md:flex items-center justify-center h-full absolute gap-4">
                    <template v-for="link in links" :key="link.label">
                        <div
                            v-if="link.menu"
                            class="relative h-[60%] flex items-center"
                            @mouseenter="propertiesOpen = true"
                            @mouseleave="propertiesOpen = false"
                        >
                            <NuxtLink
                                :to="link.to"
                                :class="[
                                    'h-full px-3 text-sm flex items-center gap-1.5 transition-all cursor-pointer',
                                    transparent
                                        ? (isActive(link.match)
                                            ? 'border-b-2 border-white text-white'
                                            : 'text-white/80 hover:text-white')
                                        : (isActive(link.match)
                                            ? 'border-b-2 border-primary text-primary'
                                            : 'text-secondary/70 hover:text-primary')
                                ]"
                            >
                                {{ link.label }}
                                <LucideChevronDown :class="['size-3.5 transition-transform', propertiesOpen ? 'rotate-180' : '']" />
                            </NuxtLink>

                            <Transition
                                enter-active-class="transition duration-150 ease-out"
                                leave-active-class="transition duration-100 ease-in"
                                enter-from-class="opacity-0 translate-y-1"
                                leave-to-class="opacity-0 translate-y-1"
                            >
                                <div
                                    v-if="propertiesOpen"
                                    class="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[300px]"
                                >
                                    <div class="bg-white rounded-lg shadow-lg border border-border overflow-hidden py-2">
                                        <NuxtLink
                                            v-for="item in link.menu"
                                            :key="item.label"
                                            :to="item.to"
                                            class="flex items-start gap-3 px-4 py-3 hover:bg-primary/5 transition-colors group"
                                        >
                                            <div class="size-9 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                                <component :is="item.icon" class="size-4 text-primary" />
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
                                transparent
                                    ? (isActive(link.match)
                                        ? 'border-b-2 border-white text-white'
                                        : 'text-white/80 hover:text-white')
                                    : (isActive(link.match)
                                        ? 'border-b-2 border-primary text-primary'
                                        : 'text-secondary/70 hover:text-primary')
                            ]"
                        >
                            {{ link.label }}
                        </NuxtLink>
                    </template>
                </div>

                <div class="hidden md:flex items-center h-full">
                    <NuxtLink :to="{ name: 'contact' }">
                        <Button :class="transparent ? 'bg-white text-primary hover:bg-white/90' : ''">
                            List Your Property
                        </Button>
                    </NuxtLink>
                </div>

                <div class="md:hidden flex items-center gap-3">
                    <LucideGlobe :class="['size-5.5', transparent ? 'text-white' : 'text-secondary/70']" />
                    <button
                        class="flex items-center justify-center p-2"
                        @click="mobileOpen = true"
                        aria-label="Open menu"
                    >
                        <LucideMenu :class="['size-7', transparent ? 'text-white' : 'text-secondary']" />
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
                    <img src="/images/logo.png" class="h-[50%]" alt="">
                    <button @click="mobileOpen = false" aria-label="Close menu">
                        <LucideX class="size-6 text-secondary" />
                    </button>
                </div>
                <nav class="flex flex-col p-4 gap-1">
                    <template v-for="link in links" :key="link.label">
                        <div v-if="link.menu" class="flex flex-col">
                            <button
                                class="flex items-center justify-between px-4 py-3 rounded-md text-base text-secondary hover:bg-primary/5 transition-colors"
                                @click="mobilePropOpen = !mobilePropOpen"
                            >
                                {{ link.label }}
                                <LucideChevronDown :class="['size-4 transition-transform', mobilePropOpen ? 'rotate-180' : '']" />
                            </button>
                            <div v-if="mobilePropOpen" class="ms-3 mt-1 flex flex-col gap-1 border-s border-border ps-3">
                                <NuxtLink
                                    v-for="item in link.menu"
                                    :key="item.label"
                                    :to="item.to"
                                    @click="mobileOpen = false"
                                    class="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-primary/5 transition-colors"
                                >
                                    <div class="size-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                        <component :is="item.icon" class="size-4 text-primary" />
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
                </nav>
                <div class="p-4 pt-2">
                    <NuxtLink :to="{ name: 'contact' }" @click="mobileOpen = false">
                        <Button class="w-full">
                            List Your Property
                        </Button>
                    </NuxtLink>
                    <div class="flex items-center gap-2 mt-4 text-primary">
                        <LucidePhone class="size-4" />
                        <p class="text-sm">+962 7 9999 9999</p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { LucideHome, LucideKey } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'

const { y } = useWindowScroll()
const transparent = computed(() => y.value < 10)

const mobileOpen = ref(false)
const mobilePropOpen = ref(false)
const propertiesOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { mobileOpen.value = false })

const links = [
    { label: 'Home', to: { name: 'home' }, match: '/' },
    { label: 'About', to: { name: 'about' }, match: '/about' },
    {
        label: 'Properties',
        to: { name: 'properties' },
        match: '/properties',
        menu: [
            { label: 'Properties for Sale', desc: 'Villas, apartments & more', to: { name: 'properties', query: { type: 'sale' } }, icon: LucideHome },
            { label: 'Properties for Rent', desc: 'Monthly & annual leases', to: { name: 'properties', query: { type: 'rent' } }, icon: LucideKey },
        ],
    },
    { label: 'Services', to: { name: 'services' }, match: '/services' },
    { label: 'Areas', to: { name: 'areas' }, match: '/areas' },
    { label: 'Contact', to: { name: 'contact' }, match: '/contact' },
]

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>

<style></style>
