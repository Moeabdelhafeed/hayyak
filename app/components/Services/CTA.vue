<template>
    <section class="py-12 md:py-20 bg-primary">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="font-display text-2xl md:text-3xl text-white font-bold">Ready to Get Started?</h2>
                    <p class="text-white/70 mt-3">
                        Contact our team today to discuss how we can help optimize your property portfolio.
                    </p>
                </div>
                <NuxtLink
                    :to="{ name: 'contact' }"
                    class="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary rounded-md hover:bg-white/90 transition-colors text-sm md:text-base"
                >
                    Contact Us
                    <LucideArrowRight class="size-4 rtl:rotate-180" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup></script>
