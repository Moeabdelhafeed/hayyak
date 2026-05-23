<template>
    <div>
        <ContactHero />

        <section class="bg-white border-b border-border">
            <div class="px-4 max-w-[1350px] mx-auto">
                <div class="flex gap-1 sm:gap-2">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        type="button"
                        :class="[
                            'px-5 sm:px-7 py-4 text-sm sm:text-base font-medium transition-colors border-b-2 -mb-px',
                            active === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-secondary/60 hover:text-secondary'
                        ]"
                        @click="setTab(tab.key)"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>
        </section>

        <DefaultFadeIn v-if="active === 'general'"><ContactForm /></DefaultFadeIn>
        <DefaultFadeIn v-else><ContactCareers /></DefaultFadeIn>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

definePageMeta({ name: 'contact' })

const { t } = useT()
const route = useRoute()
const router = useRouter()

const validTabs = ['general', 'careers']
const initial = validTabs.includes(route.query.tab) ? route.query.tab : 'general'
const active = ref(initial)

const tabs = computed(() => [
    { key: 'general', label: t('contact_tab_general') },
    { key: 'careers', label: t('contact_tab_careers') },
])

const setTab = (k) => {
    active.value = k
    router.replace({ query: { ...route.query, tab: k === 'general' ? undefined : k } })
}

watch(() => route.query.tab, (v) => {
    if (validTabs.includes(v)) active.value = v
    else active.value = 'general'
})

useSeoMeta({
    title: 'Contact - Hayyak',
    description: 'Get in touch with Hayyak for property management, leasing, and advisory services.',
})
</script>
