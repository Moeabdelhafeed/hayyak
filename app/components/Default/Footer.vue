<template>
    <footer class="bg-secondary text-white">
        <div class="border-b border-white/10">
            <div class="max-w-[1350px] mx-auto px-4 py-12">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div>
                        <h3 class="font-display text-xl sm:text-2xl font-bold">{{ t('footer_newsletter_title') }}</h3>
                        <p class="text-white/60 text-sm sm:text-base max-w-md mt-2">
                            {{ t('footer_newsletter_body') }}
                        </p>
                    </div>
                    <form class="flex w-full lg:w-auto max-w-md" @submit.prevent>
                        <input
                            v-model="email"
                            type="email"
                            :placeholder="t('footer_newsletter_email_placeholder')"
                            required
                            class="flex-1 lg:w-72 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-brand-cyan-neon focus:shadow-[0_0_14px_rgba(85,255,255,0.4)] transition-all rounded-s-md"
                        >
                        <button
                            type="submit"
                            class="px-6 py-3 bg-brand-orange text-white hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,107,38,0.6)] transition-all flex items-center gap-2 rounded-e-md whitespace-nowrap"
                        >
                            {{ t('footer_newsletter_subscribe') }}
                            <LucideArrowRight class="size-4 rtl:rotate-180" />
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
                        {{ t('footer_description') }}
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
                    <h4 class="font-display text-white text-sm uppercase tracking-wider mb-5">{{ t('footer_services_heading') }}</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="s in servicesLinks" :key="s.slug">
                            <NuxtLink :to="{ name: 'service-detail', params: { slug: s.slug } }" class="text-white/50 hover:text-white transition-colors">
                                {{ s.title }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-display text-white text-sm uppercase tracking-wider mb-5">{{ t('footer_quick_links_heading') }}</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="l in quickLinks" :key="l.key">
                            <NuxtLink :to="l.to" class="text-white/50 hover:text-white transition-colors">
                                {{ l.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-display text-white text-sm uppercase tracking-wider mb-5">{{ t('footer_contact_heading') }}</h4>
                    <ul class="flex flex-col gap-4 text-sm">
                        <li class="flex items-start gap-3">
                            <LucideMapPin class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <span class="text-white/50">{{ siteAddress }}</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <LucidePhone class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a :href="`tel:${siteTel}`" class="text-white/50 hover:text-white transition-colors">{{ sitePhone }}</a>
                        </li>
                        <li class="flex items-start gap-3">
                            <LucideMail class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a :href="`mailto:${siteEmail}`" class="text-white/50 hover:text-white transition-colors">{{ siteEmail }}</a>
                        </li>
                    </ul>
                    <div class="mt-6">
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=DotMedia+Amman+Jordan"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex items-center gap-2 text-sm text-brand-cyan-neon hover:text-white transition-colors"
                        >
                            {{ t('footer_get_directions') }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-white/10">
            <div class="max-w-[1350px] mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p class="text-white/40 text-xs">
                    © {{ year }} {{ t('footer_copyright') }}
                </p>
                <div class="flex flex-wrap items-center gap-6 text-xs">
                    <NuxtLink
                        v-for="p in pageLinks"
                        :key="p.slug"
                        :to="{ name: 'page-slug', params: { slug: p.slug } }"
                        class="text-white/40 hover:text-white/70 transition-colors"
                    >
                        {{ p.title }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const { t } = useT()
const email = ref('')
const locale = useCookie('locale', { default: () => 'en' })

const { data: settingsRes } = await useFetch('/api/settings', {
    watch: [locale],
    key: `footer-settings-${locale.value}`,
})
const { data: pagesRes } = await useFetch('/api/pages', {
    watch: [locale],
    key: `footer-pages-${locale.value}`,
})

const services = useServices()

const servicesLinks = computed(() => services.value.map(s => ({ slug: s.slug, title: s.title })))

const quickLinks = computed(() => [
    { key: 'home', label: t('nav_home'), to: { name: 'home' } },
    { key: 'about', label: t('nav_about'), to: { name: 'about' } },
    { key: 'properties', label: t('nav_properties'), to: { name: 'properties' } },
    { key: 'services', label: t('nav_services'), to: { name: 'services' } },
    { key: 'areas', label: t('nav_areas'), to: { name: 'areas' } },
    { key: 'contact', label: t('nav_contact'), to: { name: 'contact' } },
])

const pageLinks = computed(() => {
    const list = pagesRes.value?.data?.data ?? pagesRes.value?.data ?? []
    return list.map(p => ({ slug: p.slug, title: p.title }))
})

const settingsMap = computed(() => {
    const arr = settingsRes.value?.data ?? []
    return Object.fromEntries(arr.map(s => [s.key, s.value]))
})

const siteAddress = computed(() => settingsMap.value.app_address || 'Amman, Jordan')
const sitePhone = computed(() => settingsMap.value.app_phone || '+962 6 XXX XXXX')
const siteTel = computed(() => sitePhone.value.replace(/\s+/g, ''))
const siteEmail = computed(() => settingsMap.value.app_email || 'info@hayyak.jo')
const year = new Date().getFullYear()

const socials = computed(() => {
    const m = settingsMap.value
    return [
        { name: 'facebook', href: m.facebook_url || '#', icon: LucideFacebook },
        { name: 'instagram', href: m.instagram_url || '#', icon: LucideInstagram },
        { name: 'linkedin', href: m.linkedin_url || '#', icon: LucideLinkedin },
        { name: 'twitter', href: m.twitter_url || '#', icon: LucideTwitter },
    ]
})

</script>

<style scoped></style>
