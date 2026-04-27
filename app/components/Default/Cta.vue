<template>
    <section class="bg-secondary text-white">
        <div class="max-w-[1350px] mx-auto px-4 py-10 md:py-14">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p class="text-primary-light text-xs uppercase tracking-[0.2em] font-medium">
                        {{ eyebrow }}
                    </p>
                    <h2 class="text-2xl md:text-3xl font-bold mt-3">
                        {{ title }}
                    </h2>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <NuxtLink
                        :to="primaryTo"
                        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-md hover:bg-white/90 transition-colors text-sm font-medium"
                    >
                        <LucideKey class="size-4" />
                        {{ primaryLabel }}
                    </NuxtLink>
                    <NuxtLink
                        :to="secondaryTo"
                        class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <LucideHome class="size-4" />
                        {{ secondaryLabel }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    eyebrow: { type: String, default: "Can't find what you're looking for?" },
    title: { type: String, default: 'Let Our Experts Find It for You' },
    primaryLabel: { type: String, default: 'Book a Consultation' },
    primaryTo: { type: [String, Object], default: () => ({ name: 'contact' }) },
    secondaryLabel: { type: String, default: 'List Your Property' },
    secondaryTo: { type: [String, Object], default: () => ({ name: 'contact' }) },
})
</script>
