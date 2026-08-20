<template>
  <section v-if="hasHero" class="bg-secondary relative overflow-hidden py-20 md:py-28">
    <div v-if="image" class="absolute inset-0 opacity-15">
      <NuxtImg :src="image" alt="" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw" loading="eager" fetchpriority="high" class="h-full w-full object-cover" />
    </div>
    <div class="relative mx-auto max-w-[1350px] px-4 pt-20">
      <p class="text-brand-cyan-neon text-xs tracking-[0.15em] uppercase">
        {{ t('about_hero_eyebrow') }}
      </p>
      <h1
        v-if="title"
        class="font-display mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
      >
        {{ title }}
      </h1>

      <div
        v-if="description"
        v-html="description"
        class="cms-body mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const { about } = useAbout()

const hero = computed(() => about.value.hero ?? {})
const title = computed(() => hero.value.title || '')
const image = computed(() => hero.value.image || '')
const description = computed(() => hero.value.description || '')
const hasHero = computed(() => !!(title.value || description.value))
</script>
