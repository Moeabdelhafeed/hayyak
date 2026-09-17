<template>
  <section v-if="hasContent" class="bg-white py-12 md:py-20">
    <div class="mx-auto max-w-[1350px] px-4">
      <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p class="text-primary text-xs tracking-[0.15em] uppercase">
            {{ t('about_welcome_eyebrow') }}
          </p>
          <h2 v-if="title" class="font-display text-secondary mt-2 text-2xl font-bold md:text-3xl">
            {{ title }}
          </h2>
          <div
            v-if="description"
            v-html="description"
            class="text-primary/80 mt-6 leading-relaxed"
          />
        </div>
        <div v-if="image">
          <NuxtImg format="webp" :src="image" alt="Hayyak team" loading="lazy" sizes="sm:100vw lg:50vw" class="h-[420px] w-full rounded-lg object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const { about } = useAbout()

const why = computed(() => about.value.why_hayyak ?? {})
const title = computed(() => why.value.title || '')
const image = computed(() => why.value.image || '')
const description = computed(() => why.value.description || '')
const hasContent = computed(() => !!(title.value || description.value))
</script>
