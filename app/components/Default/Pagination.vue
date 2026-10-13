<!-- Shared numbered pager. Windowed page list with first/last always shown and '…'
     for gaps — used by the property grid and the insights lists so they match. -->
<template>
    <div v-if="lastPage > 1" class="mt-10 flex items-center justify-center gap-3">
        <button
            class="border-border text-secondary hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-secondary flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition-colors disabled:opacity-40"
            :disabled="page === 1"
            @click="go(page - 1)"
            :aria-label="t('properties_grid_prev_page')"
        >
            <LucideChevronLeft class="size-4 rtl:rotate-180" />
        </button>
        <template v-for="(p, idx) in pageItems" :key="idx">
            <span
                v-if="p === '…'"
                class="text-secondary/60 flex h-10 w-10 items-center justify-center text-sm"
            >
                …
            </span>
            <button
                v-else
                :class="[
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors',
                    page === p
                        ? 'bg-primary border-primary border text-white'
                        : 'text-secondary/80 border-border hover:border-primary hover:text-primary border bg-transparent',
                ]"
                :aria-current="page === p ? 'page' : undefined"
                @click="go(p)"
            >
                {{ p }}
            </button>
        </template>
        <button
            class="border-border text-secondary hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-secondary flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition-colors disabled:opacity-40"
            :disabled="page === lastPage"
            @click="go(page + 1)"
            :aria-label="t('properties_grid_next_page')"
        >
            <LucideChevronRight class="size-4 rtl:rotate-180" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    page: { type: Number, default: 1 },
    lastPage: { type: Number, default: 1 },
})
const emit = defineEmits(['update:page'])
const { t } = useT()

const go = (p) => {
    const next = Math.min(props.lastPage, Math.max(1, Number(p) || 1))
    if (next !== props.page) emit('update:page', next)
}

const pageItems = computed(() => {
    const lp = props.lastPage
    const cur = props.page
    if (lp <= 7) return Array.from({ length: lp }, (_, i) => i + 1)

    const items = [1]
    const start = Math.max(2, cur - 1)
    const end = Math.min(lp - 1, cur + 1)
    if (start > 2) items.push('…')
    for (let p = start; p <= end; p++) items.push(p)
    if (end < lp - 1) items.push('…')
    items.push(lp)
    return items
})
</script>
