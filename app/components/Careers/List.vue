<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-[1350px] mx-auto">
            <p v-if="pending" class="text-primary/70 text-sm">{{ t('careers_list_loading') }}</p>
            <p v-else-if="error" class="text-red-600 text-sm">{{ t('careers_list_error') }}</p>
            <p v-else-if="!jobs.length" class="text-primary/70 text-sm">{{ t('careers_list_empty') }}</p>

            <div v-else class="flex flex-col gap-4">
                <NuxtLink
                    v-for="job in jobs"
                    :key="job.id"
                    :to="{ name: 'career-detail', params: { slug: job.slug } }"
                    class="group bg-white border border-border rounded-xl p-5 md:p-6 hover:shadow-lg hover:border-brand-turquoise/40 transition-all flex flex-col md:flex-row md:items-center gap-4"
                >
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="font-display text-secondary text-lg font-bold">{{ job.title }}</h3>
                            <span v-if="job.department" class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-turquoise/10 text-brand-turquoise">{{ job.department }}</span>
                        </div>
                        <p v-if="job.summary" class="text-primary/75 text-sm mt-2 line-clamp-2">{{ job.summary }}</p>
                        <div class="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-primary/70 text-xs">
                            <span v-if="job.location" class="inline-flex items-center gap-1.5"><LucideMapPin class="size-3.5" /> {{ job.location }}</span>
                            <span v-if="job.employment_type" class="inline-flex items-center gap-1.5"><LucideBriefcase class="size-3.5" /> {{ employmentType(job.employment_type) }}</span>
                            <span v-if="job.salary_range" class="inline-flex items-center gap-1.5"><LucideWallet class="size-3.5" /> {{ job.salary_range }}</span>
                        </div>
                    </div>
                    <span class="inline-flex items-center gap-1.5 text-brand-turquoise text-sm font-medium shrink-0 group-hover:gap-2.5 transition-all">
                        {{ t('careers_list_view_job') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </span>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { LucideMapPin, LucideBriefcase, LucideWallet, LucideArrowRight } from 'lucide-vue-next'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data, pending, error } = await useFetch('/api/careers', {
    watch: [locale],
    key: 'careers-list',
})

const jobs = computed(() => data.value?.data?.data ?? [])

const employmentType = (type) => {
    const key = `careers_employment_${type}`
    const label = t(key)
    return label === key ? String(type).replace(/_/g, ' ') : label
}
</script>
