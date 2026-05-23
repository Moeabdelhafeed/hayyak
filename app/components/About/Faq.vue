<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-4xl mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ t('about_faq_title') }}</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="group in groups" :key="group.title">
                    <h3 class="font-display text-sm text-primary mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <LucideUsers class="size-4" />
                        {{ group.title }}
                    </h3>
                    <div class="flex flex-col gap-3">
                        <details
                            v-for="item in group.items"
                            :key="item.q"
                            class="bg-white rounded-md border border-border p-4 group"
                        >
                            <summary class="cursor-pointer list-none flex justify-between items-center text-sm text-secondary">
                                <span>{{ item.q }}</span>
                                <span class="text-primary text-lg group-open:rotate-45 transition-transform ms-3">+</span>
                            </summary>
                            <p class="mt-3 text-primary/80 text-sm leading-relaxed">
                                {{ item.a }}
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()

const groups = computed(() => [
    {
        title: t('about_faq_for_owners'),
        items: [
            { q: t('about_faq_owners_q1'), a: t('about_faq_owners_a1') },
            { q: t('about_faq_owners_q2'), a: t('about_faq_owners_a2') },
            { q: t('about_faq_owners_q3'), a: t('about_faq_owners_a3') },
        ],
    },
    {
        title: t('about_faq_for_tenants'),
        items: [
            { q: t('about_faq_tenants_q1'), a: t('about_faq_tenants_a1') },
            { q: t('about_faq_tenants_q2'), a: t('about_faq_tenants_a2') },
            { q: t('about_faq_tenants_q3'), a: t('about_faq_tenants_a3') },
        ],
    },
])
</script>

<style>
details > summary::-webkit-details-marker { display: none; }
</style>
