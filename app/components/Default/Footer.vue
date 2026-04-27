<template>
    <footer class="bg-[#0f1f26] text-white">
        <div class="border-b border-white/10">
            <div class="max-w-[1350px] mx-auto px-4 py-12">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-bold">Stay Informed</h3>
                        <p class="text-white/60 text-sm sm:text-base max-w-md mt-2">
                            Subscribe to receive market reports, investment insights, and exclusive property listings.
                        </p>
                    </div>
                    <form class="flex w-full lg:w-auto max-w-md" @submit.prevent>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            class="flex-1 lg:w-72 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-primary-light transition-colors rounded-s-md"
                        >
                        <button
                            type="submit"
                            class="px-6 py-3 bg-primary text-white hover:bg-primary/80 transition-colors flex items-center gap-2 rounded-e-md whitespace-nowrap"
                        >
                            Subscribe
                            <LucideArrowRight class="size-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="max-w-[1350px] mx-auto px-4 py-14">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
                <div class="lg:col-span-2 flex flex-col gap-5">
                    <img src="/images/logo.png" alt="Hayyak" class="h-9 w-max brightness-0 invert">
                    <p class="text-white/60 text-sm leading-relaxed max-w-sm">
                        Jordan's premier tech-enabled property management company. A division of Thabat, backed by the Kingdom's largest financial institutions.
                    </p>
                    <div class="flex items-center gap-3 pt-1">
                        <a
                            v-for="social in socials"
                            :key="social.name"
                            :href="social.href"
                            class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
                        >
                            <component :is="social.icon" class="size-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="text-white text-sm uppercase tracking-wider mb-5">Services</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="s in servicesLinks" :key="s">
                            <NuxtLink :to="{ name: 'services' }" class="text-white/50 hover:text-white transition-colors">
                                {{ s }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white text-sm uppercase tracking-wider mb-5">Areas We Cover</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="a in areasLinks" :key="a.slug">
                            <NuxtLink :to="{ name: 'areas', hash: `#${a.slug}` }" class="text-white/50 hover:text-white transition-colors">
                                {{ a.title }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white text-sm uppercase tracking-wider mb-5">Contact</h4>
                    <ul class="flex flex-col gap-4 text-sm">
                        <li class="flex items-start gap-3">
                            <LucideMapPin class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <span class="text-white/50">Amman, Jordan</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <LucidePhone class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a href="tel:+96265555555" class="text-white/50 hover:text-white transition-colors">+962 6 XXX XXXX</a>
                        </li>
                        <li class="flex items-start gap-3">
                            <LucideMail class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a href="mailto:info@hayyak.jo" class="text-white/50 hover:text-white transition-colors">info@hayyak.jo</a>
                        </li>
                    </ul>
                    <div class="mt-6">
                        <NuxtLink
                            :to="{ name: 'contact' }"
                            class="inline-flex items-center gap-2 text-sm text-primary-light hover:text-white transition-colors"
                        >
                            Get Directions
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-white/10">
            <div class="max-w-[1350px] mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p class="text-white/40 text-xs">
                    2026 Hayyak Property Management. A division of Thabat. All rights reserved.
                </p>
                <div class="flex gap-6 text-xs">
                    <NuxtLink :to="{ name: 'home' }" class="text-white/40 hover:text-white/70 transition-colors">Privacy Policy</NuxtLink>
                    <NuxtLink :to="{ name: 'home' }" class="text-white/40 hover:text-white/70 transition-colors">Terms & Conditions</NuxtLink>
                    <NuxtLink :to="{ name: 'home' }" class="text-white/40 hover:text-white/70 transition-colors">Cookie Policy</NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter } from 'lucide-vue-next'
import { ref } from 'vue'
import { areas } from '../Areas/data'

const email = ref('')

const socials = [
    { name: 'facebook', href: '#', icon: LucideFacebook },
    { name: 'instagram', href: '#', icon: LucideInstagram },
    { name: 'linkedin', href: '#', icon: LucideLinkedin },
    { name: 'twitter', href: '#', icon: LucideTwitter },
]

const servicesLinks = [
    'Property Management',
    'Rentals & Leasing',
    'Sales & Acquisitions',
    'Consultancy',
    'Valuation',
    'Asset Management',
]

const areasLinks = areas.slice(0, 6)
</script>

<style scoped></style>
