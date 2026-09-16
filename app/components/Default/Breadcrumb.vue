<template>
    <nav :aria-label="t('breadcrumb_label', 'Breadcrumb')" class="flex items-center gap-2 flex-wrap">
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
const props = defineProps({
    // [{ name, to? }] — last item is the current page (rendered unlinked)
    items: { type: Array, required: true },
})
const { t } = useT()
const localePath = useLocalePath()

// The BreadcrumbList is emitted from the same `items` that render the visible trail,
// so the two can't drift apart — that match is what Google actually checks.
// `localePath` is the reason this lives here: the previous per-page defineBreadcrumb
// calls hardcoded '/' and '/insights', which under i18n `strategy: 'prefix'` are not
// routes at all. Every Arabic page was declaring English pages as its ancestors.
useSchemaOrg([
    defineBreadcrumb({
        itemListElement: computed(() =>
            props.items.map((item, i) => ({
                name: item.name,
                // Google wants no `item` on the final (current) crumb.
                ...(item.to && i < props.items.length - 1 ? { item: localePath(item.to) } : {}),
            })),
        ),
    }),
])
</script>
