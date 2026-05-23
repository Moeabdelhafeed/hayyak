<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-8 md:mb-10">
                <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ t('services_additional_title') }}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <div
                    v-for="item in items"
                    :key="item.title"
                    class="bg-white p-6 rounded-lg border border-border hover:shadow-md transition-shadow h-full"
                >
                    <h3 class="font-display text-secondary text-base font-medium">{{ item.title }}</h3>
                    <p class="text-primary/80 text-sm mt-2">{{ item.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()

const items = computed(() => [
    { title: t('services_additional_1_title'), desc: t('services_additional_1_body') },
    { title: t('services_additional_2_title'), desc: t('services_additional_2_body') },
    { title: t('services_additional_3_title'), desc: t('services_additional_3_body') },
    { title: t('services_additional_4_title'), desc: t('services_additional_4_body') },
    { title: t('services_additional_5_title'), desc: t('services_additional_5_body') },
    { title: t('services_additional_6_title'), desc: t('services_additional_6_body') },
])
</script>
