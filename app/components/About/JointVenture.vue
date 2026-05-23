<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_jv_eyebrow') }}</p>
                <h2 class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('about_jv_title') }}</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
                <div
                    v-for="entity in entities"
                    :key="entity.title"
                    class="bg-white p-6 md:p-7 rounded-lg border border-border h-full"
                >
                    <div class="w-12 h-12 rounded-md bg-primary/8 flex items-center justify-center">
                        <component :is="entity.icon" class="size-6 text-primary" />
                    </div>
                    <h3 class="font-display text-secondary font-bold text-lg mt-4 ">{{ entity.title }}</h3>
                    <p class="text-primary/80 text-sm leading-relaxed mt-3">
                        {{ entity.description }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { LucideLandmark, LucideBuilding } from 'lucide-vue-next'

const { t } = useT()

const entities = computed(() => [
    { icon: LucideLandmark, title: t('about_jv_thabat_title'), description: t('about_jv_thabat_body') },
    { icon: LucideBuilding, title: t('about_jv_brightlevant_title'), description: t('about_jv_brightlevant_body') },
])
</script>
