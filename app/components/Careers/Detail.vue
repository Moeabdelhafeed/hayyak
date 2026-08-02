<template>
    <section class="py-10 md:py-16 bg-[#f8fafb] min-h-[60vh]">
        <div class="px-4 max-w-[900px] mx-auto">
            <NuxtLinkLocale :to="{ name: 'careers' }" class="inline-flex items-center gap-1.5 text-primary/60 hover:text-brand-turquoise text-sm transition-colors mb-6">
                <LucideArrowLeft class="size-4 rtl:rotate-180" />
                {{ t('careers_detail_back') }}
            </NuxtLinkLocale>

            <div class="bg-white border border-border rounded-xl p-6 md:p-8">
                <div class="flex flex-wrap items-center gap-2">
                    <h1 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ job.title }}</h1>
                    <span v-if="job.department" class="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-turquoise/10 text-brand-turquoise">{{ job.department }}</span>
                </div>

                <div class="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-primary/75 text-sm">
                    <span v-if="job.location" class="inline-flex items-center gap-1.5"><LucideMapPin class="size-4" /> {{ job.location }}</span>
                    <span v-if="job.employment_type" class="inline-flex items-center gap-1.5"><LucideBriefcase class="size-4" /> {{ employmentType(job.employment_type) }}</span>
                    <span v-if="job.salary_range" class="inline-flex items-center gap-1.5"><LucideWallet class="size-4" /> {{ job.salary_range }}</span>
                </div>

                <p v-if="job.summary" class="text-primary/85 mt-5 leading-relaxed">{{ job.summary }}</p>

                <div v-if="job.description" class="mt-6">
                    <h2 class="font-display text-secondary text-base font-bold">{{ t('careers_detail_description') }}</h2>
                    <p class="text-primary/80 text-sm mt-2 leading-relaxed whitespace-pre-line">{{ job.description }}</p>
                </div>

                <div v-if="job.requirements" class="mt-6">
                    <h2 class="font-display text-secondary text-base font-bold">{{ t('careers_detail_requirements') }}</h2>
                    <p class="text-primary/80 text-sm mt-2 leading-relaxed whitespace-pre-line">{{ job.requirements }}</p>
                </div>

                <div v-if="job.benefits" class="mt-6">
                    <h2 class="font-display text-secondary text-base font-bold">{{ t('careers_detail_benefits') }}</h2>
                    <p class="text-primary/80 text-sm mt-2 leading-relaxed whitespace-pre-line">{{ job.benefits }}</p>
                </div>

                <div class="mt-8">
                    <NuxtLinkLocale
                        :to="{ name: 'career-apply', query: { slug: job.slug } }"
                        class="inline-flex items-center gap-2 px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,91,0,0.45)] transition-all text-sm font-medium"
                    >
                        {{ t('careers_detail_apply') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { LucideMapPin, LucideBriefcase, LucideWallet, LucideArrowLeft, LucideArrowRight } from 'lucide-vue-next'

const { t } = useT()

defineProps({
    job: { type: Object, default: () => ({}) },
})

const employmentType = (type) => {
    const key = `careers_employment_${type}`
    const label = t(key)
    return label === key ? String(type).replace(/_/g, ' ') : label
}
</script>
