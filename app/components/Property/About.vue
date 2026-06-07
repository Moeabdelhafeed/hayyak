<template>
    <div v-if="description || descriptionHtml">
        <h2 class="font-display text-secondary text-lg md:text-xl font-bold">{{ t('property_about_title') }}</h2>
        <div class="mt-3 border-s-2 border-brand-turquoise ps-4">
            <div
                v-if="isHtml"
                class="property-prose text-brand-turquoise text-sm md:text-base leading-relaxed"
                v-html="descriptionHtml"
            />
            <p v-else class="text-brand-turquoise text-sm md:text-base leading-relaxed whitespace-pre-line">
                {{ plainText }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const props = defineProps({
    description: { type: String, default: '' },
    descriptionHtml: { type: String, default: '' },
})

// CMS sends marketing_description_html as plain text with newlines/bullets (no tags).
// Only use v-html when real markup is present; otherwise render as pre-line text so
// line breaks and bullets survive instead of collapsing into a wall of text.
const isHtml = computed(() => /<[a-z][\s\S]*>/i.test(props.descriptionHtml))
const plainText = computed(() => props.description || props.descriptionHtml)
</script>

<style scoped>
.property-prose :deep(p) { margin-bottom: 0.75rem; }
.property-prose :deep(p:last-child) { margin-bottom: 0; }
.property-prose :deep(h1),
.property-prose :deep(h2),
.property-prose :deep(h3),
.property-prose :deep(h4) { font-weight: 700; color: var(--secondary); margin: 1rem 0 0.5rem; line-height: 1.3; }
.property-prose :deep(h1) { font-size: 1.25rem; }
.property-prose :deep(h2) { font-size: 1.125rem; }
.property-prose :deep(h3) { font-size: 1rem; }
.property-prose :deep(ul),
.property-prose :deep(ol) { padding-inline-start: 1.25rem; margin: 0.5rem 0; }
.property-prose :deep(ul) { list-style: disc; }
.property-prose :deep(ol) { list-style: decimal; }
.property-prose :deep(li) { margin: 0.25rem 0; }
.property-prose :deep(a) { color: var(--primary); text-decoration: underline; }
.property-prose :deep(strong) { font-weight: 700; }
.property-prose :deep(br) { content: ""; }
</style>
