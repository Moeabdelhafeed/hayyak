<template>
    <section v-if="rows.length" class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-3xl mx-auto">
            <div class="text-center mb-8 md:mb-10">
                <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ t('about_comparison_title') }}</h2>
            </div>
            <div class="bg-white rounded-lg overflow-hidden border border-border">
                <div class="grid grid-cols-2 bg-secondary text-white text-sm">
                    <div class="p-4 text-center">{{ t('about_comparison_col_traditional') }}</div>
                    <div class="p-4 text-center">{{ t('about_comparison_col_hayyak') }}</div>
                </div>
                <div
                    v-for="(row, idx) in rows"
                    :key="idx"
                    :class="['grid grid-cols-2', idx % 2 === 1 ? 'bg-primary/2' : '']"
                >
                    <div class="p-4 text-center text-primary/80 text-sm border-e border-border/50">
                        {{ row.traditional }}
                    </div>
                    <div class="p-4 text-center text-primary/80 text-sm flex items-center justify-center gap-2">
                        <LucideCircleCheck class="size-4 shrink-0" />
                        {{ row.hayyak }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const { about } = useAbout()

const rows = computed(() =>
    [...(about.value.comparison ?? [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(r => ({ traditional: r.traditional || '', hayyak: r.hayyak || '' }))
)
</script>
