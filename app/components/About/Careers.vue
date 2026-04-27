<template>
    <section id="careers" class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto text-center">
            <p class="text-primary text-xs uppercase tracking-[0.15em]">Careers</p>
            <h2 class="text-secondary text-2xl md:text-3xl mt-2 font-bold">Join Our Team</h2>
            <p class="text-primary/80 max-w-xl mx-auto text-sm leading-relaxed mt-4">
                We're always looking for talented professionals passionate about real estate and technology to join our growing team.
            </p>
            <NuxtLink
                :to="{ name: 'contact' }"
                class="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm md:text-base"
            >
                Get in Touch
                <LucideArrowRight class="size-4 rtl:rotate-180" />
            </NuxtLink>
        </div>
    </section>
</template>

<script setup></script>
