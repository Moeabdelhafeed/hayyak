<template>
    <footer class="bg-secondary text-white">
        <div class="max-w-[1350px] mx-auto px-4 py-14">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
                <div class="lg:col-span-2 flex flex-col gap-5">
                    <NuxtLink :to="{ name: 'home' }" aria-label="Home">
                        <img :src="logoSrc" alt="Hayyak" class="h-9 w-max brightness-0 invert">
                    </NuxtLink>
                    <p class="text-white/60 text-sm leading-relaxed max-w-sm">
                        {{ t('footer_description') }}
                    </p>
                    <div class="flex items-center gap-3 pt-1">
                        <a
                            v-for="social in socials"
                            :key="social.name"
                            :href="social.href"
                            target="_blank"
                            rel="noopener"
                            class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-brand-cyan-neon hover:border-brand-cyan-neon transition-colors"
                        >
                            <component :is="social.icon" class="size-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="font-display text-brand-cyan text-sm uppercase tracking-wider mb-5">{{ t('footer_services_heading') }}</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="s in servicesLinks" :key="s.id">
                            <NuxtLink :to="{ name: 'service-detail', params: { id: s.id } }" class="text-white/50 hover:text-white transition-colors">
                                {{ s.title }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-display text-brand-cyan text-sm uppercase tracking-wider mb-5">{{ t('footer_quick_links_heading') }}</h4>
                    <ul class="flex flex-col gap-3 text-sm">
                        <li v-for="l in quickLinks" :key="l.key">
                            <NuxtLink :to="l.to" class="text-white/50 hover:text-white transition-colors">
                                {{ l.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-display text-brand-cyan text-sm uppercase tracking-wider mb-5">{{ t('footer_contact_heading') }}</h4>
                    <ul class="flex flex-col gap-4 text-sm">
                        <li v-if="settings.app_address" class="flex items-start gap-3">
                            <LucideMapPin class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <component :is="settings.app_address_url ? 'a' : 'span'" :href="settings.app_address_url || undefined" target="_blank" rel="noopener" class="text-white/50 hover:text-white transition-colors">{{ settings.app_address }}</component>
                        </li>
                        <li v-if="settings.app_phone" class="flex items-start gap-3">
                            <LucidePhone class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a :href="`tel:${phoneDigits}`" dir="ltr" class="text-white/50 hover:text-white transition-colors">{{ settings.app_phone }}</a>
                        </li>
                        <li v-if="settings.app_email" class="flex items-start gap-3">
                            <LucideMail class="size-4 mt-0.5 text-white/40 shrink-0" />
                            <a :href="`mailto:${settings.app_email}`" dir="ltr" class="text-white/50 hover:text-white transition-colors">{{ settings.app_email }}</a>
                        </li>
                    </ul>
                    <div v-if="settings.app_address_url" class="mt-6">
                        <a
                            :href="settings.app_address_url"
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
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter, LucideYoutube } from 'lucide-vue-next'
import { computed } from 'vue'

const { t } = useT()
const { settings, social, phoneDigits } = useSettings()
const locale = useCookie('locale', { default: () => 'en' })
const logoSrc = computed(() => {
    const ar = locale.value === 'ar'
    return (ar ? settings.value.logo_ar : settings.value.logo_en) || (ar ? '/images/logo-ar.png' : '/images/logo.png')
})

const { data: pagesRes } = await useFetch('/api/pages', {
    watch: [locale],
    key: `footer-pages-${locale.value}`,
})

const services = useServices()

const servicesLinks = computed(() => services.value.map(s => ({ id: s.id, title: s.title })))

const quickLinks = computed(() => [
    { key: 'home', label: t('nav_home'), to: { name: 'home' } },
    { key: 'about', label: t('nav_about'), to: { name: 'about' } },
    { key: 'properties', label: t('nav_properties'), to: { name: 'properties' } },
    { key: 'services', label: t('nav_services'), to: { name: 'services' } },
    { key: 'areas', label: t('nav_areas'), to: { name: 'areas' } },
    { key: 'insights', label: t('nav_insights'), to: { name: 'insights' } },
    { key: 'contact', label: t('nav_contact'), to: { name: 'contact' } },
])

const pageLinks = computed(() => {
    const list = pagesRes.value?.data?.data ?? pagesRes.value?.data ?? []
    return list.map(p => ({ slug: p.slug, title: p.title }))
})

const year = new Date().getFullYear()

const socialIcons = {
    facebook: LucideFacebook,
    instagram: LucideInstagram,
    linkedin: LucideLinkedin,
    twitter: LucideTwitter,
    youtube: LucideYoutube,
}

const socials = computed(() =>
    Object.entries(socialIcons)
        .filter(([name]) => social.value[name])
        .map(([name, icon]) => ({ name, href: social.value[name], icon }))
)

</script>

<style scoped></style>
