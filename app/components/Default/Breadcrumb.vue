<template>
    <nav :aria-label="t('breadcrumb_label', 'Breadcrumb')" class="flex items-center gap-2 text-sm flex-wrap">
        <template v-for="(item, i) in items" :key="i">
            <NuxtLinkLocale
                v-if="item.to && i < items.length - 1"
                :to="item.to"
                class="text-current/70 hover:text-current transition-colors"
            >
                {{ item.name }}
            </NuxtLinkLocale>
            <span v-else aria-current="page" class="text-current font-medium">{{ item.name }}</span>
            <LucideChevronRight v-if="i < items.length - 1" class="size-3.5 rtl:rotate-180 text-current/50 shrink-0" />
        </template>
    </nav>
</template>

<script setup>
defineProps({
    // [{ name, to? }] — last item is the current page (no link)
    items: { type: Array, required: true },
})
const { t } = useT()
</script>
