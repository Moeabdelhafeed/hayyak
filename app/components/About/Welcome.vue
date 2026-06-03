<template>
    <section v-if="hasContent" class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <p class="text-primary text-xs uppercase tracking-[0.15em]">{{ t('about_welcome_eyebrow') }}</p>
                    <h2 v-if="title" class="font-display text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ title }}</h2>
                    <p
                        v-for="(p, i) in paragraphs"
                        :key="i"
                        class="text-primary/80 leading-relaxed mt-4 first:mt-6"
                    >
                        {{ p }}
                    </p>
                </div>
                <div v-if="image">
                    <img
                        :src="image"
                        alt="Hayyak team"
                        class="rounded-lg w-full h-[420px] object-cover"
                    >
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
const paragraphs = computed(() => why.value.description ? toParagraphs(why.value.description) : [])
const hasContent = computed(() => !!(title.value || paragraphs.value.length))
</script>
