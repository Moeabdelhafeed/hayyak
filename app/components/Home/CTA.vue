<template>
    <section class="bg-primary py-12 md:py-20">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
                <div class="lg:max-w-2xl">
                    <h2 class="text-2xl md:text-3xl text-white font-bold">
                        Ready to Elevate Your Property?
                    </h2>
                    <p class="text-white/70 mt-3">
                        Whether you own one unit or an entire portfolio, Hayyak provides the structure, transparency, and strategic oversight your investment deserves.
                    </p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink
                        :to="{ name: 'contact' }"
                        class="px-7 py-3 bg-white text-primary rounded-md hover:bg-white/90 transition-colors text-sm md:text-base"
                    >
                        Book a Consultation
                    </NuxtLink>
                    <NuxtLink
                        :to="{ name: 'contact' }"
                        class="px-7 py-3 border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors text-sm md:text-base"
                    >
                        List Your Property
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
</script>

<style scoped></style>
