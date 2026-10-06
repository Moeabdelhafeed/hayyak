<template>
  <NuxtLinkLocale
    :to="{ name: 'insight-detail', params: { slug: post.slug } }"
    class="group border-brand-turquoise/15 hover:border-brand-turquoise/40 flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
  >
    <div class="bg-brand-turquoise/5 relative h-48 overflow-hidden">
      <NuxtImg
        v-if="post.image"
        format="webp"
        :src="post.image"
        :alt="post.title"
        loading="lazy"
        decoding="async"
        sizes="sm:100vw md:50vw lg:33vw"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        v-else
        class="from-brand-turquoise to-secondary flex h-full w-full items-center justify-center bg-linear-to-br"
      >
        <LucideNewspaper
          class="size-12 text-white/25 transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <span
        v-if="post.category && showCategory"
        class="absolute start-3 top-3 rounded-md px-2 py-0.5 text-[11px] tracking-wider text-white uppercase"
        :style="{ backgroundColor: categoryColor }"
      >
        {{ post.category }}
      </span>
      <span
        v-if="post.pdf"
        class="text-secondary absolute end-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[11px] shadow-sm"
      >
        <LucideFileText class="size-3" />
        PDF
      </span>
    </div>
    <div class="flex flex-1 flex-col p-6">
      <h3
        dir="auto"
        class="font-display text-secondary group-hover:text-brand-turquoise text-base font-bold transition-colors"
      >
        {{ post.title }}
      </h3>
      <p dir="auto" class="text-brand-turquoise/80 mt-2 line-clamp-3 text-sm leading-relaxed">
        {{ post.excerpt }}
      </p>
      <div v-if="post.tags.length" class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tg in post.tags.slice(0, 3)"
          :key="tg"
          class="text-brand-turquoise/80 bg-brand-turquoise/8 rounded px-1.5 py-0.5 text-[10px]"
        >
          #{{ tg }}
        </span>
      </div>
      <div
        class="border-brand-turquoise/15 mt-auto flex items-center justify-between border-t pt-4"
      >
        <span class="text-brand-turquoise/70 inline-flex items-center gap-1.5 text-xs">
          <LucideCalendar class="size-3.5" />
          {{ fmtDate(post.date) }}
        </span>
        <span
          class="text-brand-turquoise inline-flex items-center gap-1 text-sm font-medium group-hover:underline"
        >
          {{ t('common_read_more') }}
          <LucideArrowRight class="size-3.5 rtl:rotate-180" />
        </span>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup>
const { t } = useT()
const fmtDate = useInsightDate()

// The post payload carries the category's name and slug but not its colour, so join
// against the category list — the colour the CMS stores, not a hardcoded brand one.
const { categories } = useBlogCategories()

const props = defineProps({
  post: { type: Object, required: true },
  // The category page already says which category you are in.
  showCategory: { type: Boolean, default: true },
})

const categoryColor = computed(
  () =>
    categories.value.find((c) => c.slug === props.post.categorySlug)?.color ||
    'var(--brand-turquoise)',
)
</script>
