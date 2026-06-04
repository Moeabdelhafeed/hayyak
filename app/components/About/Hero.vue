<template>
    <section v-if="hasHero" class="relative bg-secondary py-20 md:py-28 overflow-hidden">
        <div v-if="image" class="absolute inset-0 opacity-15">
            <img
                :src="image"
                alt=""
                class="w-full h-full object-cover"
            >
        </div>
        <div class="relative max-w-[1350px] mx-auto px-4 pt-20">
            <p class="text-brand-cyan-neon text-xs uppercase tracking-[0.15em]">{{ t('about_hero_eyebrow') }}</p>
            <h1 v-if="title" class="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mt-3 max-w-2xl">
                {{ title }}
            </h1>
            <CmsHtml v-if="description" :html="description" class="cms-body text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed mt-4" />
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
