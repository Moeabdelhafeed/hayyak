<template>
    <div class="bg-gray-50 h-max w-full py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="w-full h-max flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p class="text-primary/80 text-sm uppercase">{{ t('home_services_eyebrow') }}</p>
                    <p class="text-secondary text-2xl md:text-3xl mt-2 font-bold">{{ t('home_services_title') }}</p>
                </div>
                <div class="flex gap-1 items-center justify-between md:justify-end md:items-end">
                    <NuxtLink
                        :to="{ name: 'services' }"
                        class="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                    >
                        {{ t('common_view_all') }}
                        <LucideChevronRight class="size-4 rtl:rotate-180" />
                    </NuxtLink>
                </div>
            </div>
            <div class="w-full h-max py-5 mt-2 md:mt-5 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <NuxtLink
                    v-for="service in services"
                    :key="service.slug"
                    :to="{ name: 'service-detail', params: { slug: service.slug } }"
                    class="bg-white border h-max rounded-lg group cursor-pointer hover:shadow-md transition-all p-4 md:p-5 duration-300 w-full flex-col gap-5 block"
                >
                    <div class="aspect-square flex items-center justify-center w-10 md:w-12 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 rounded-md">
                        <component :is="service.icon" class="text-primary size-5 md:size-6" />
                    </div>
                    <div class="text-secondary text-base md:text-lg font-medium mt-3">
                        {{ service.title }}
                    </div>
                    <div class="text-primary/80 text-sm mt-2">
                        {{ service.tag }}
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useT()
const services = useServices()
</script>

<style scoped></style>
