<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto flex flex-col gap-16 md:gap-20">
            <div
                v-for="(service, idx) in services"
                :key="service.slug"
                class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
                <div :class="idx % 2 === 0 ? 'lg:order-2' : ''">
                    <div class="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center">
                        <component :is="service.icon" class="size-5 text-primary" />
                    </div>
                    <h2 class="font-display text-secondary text-2xl md:text-3xl mt-5 font-bold">{{ service.title }}</h2>
                    <p class="text-primary text-sm italic mt-2">{{ service.tag }}</p>
                    <p class="text-primary leading-relaxed mt-4 text-[15px]">{{ service.desc }}</p>
                    <div class="flex flex-col gap-3 mt-6">
                        <div
                            v-for="b in service.bullets"
                            :key="b.text"
                            class="flex items-start gap-3"
                        >
                            <div class="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                                <component :is="b.icon" class="size-3.5 text-primary" />
                            </div>
                            <p class="text-sm leading-relaxed text-secondary/90">{{ b.text }}</p>
                        </div>
                    </div>

                    <NuxtLink
                        :to="{ name: 'service-detail', params: { slug: service.slug } }"
                        class="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm"
                    >
                        Learn More
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>
                <div :class="['relative rounded-lg overflow-hidden h-72 sm:h-96', idx % 2 === 0 ? 'lg:order-1' : '']">
                    <img :src="service.img" :alt="service.title" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { services } from './data'
</script>
