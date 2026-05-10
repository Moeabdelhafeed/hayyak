<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-4xl mx-auto">
            <div class="text-center mb-10 md:mb-12">
                <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="group in groups" :key="group.title">
                    <h3 class="font-display text-sm text-primary mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <LucideUsers class="size-4" />
                        {{ group.title }}
                    </h3>
                    <div class="flex flex-col gap-3">
                        <details
                            v-for="item in group.items"
                            :key="item.q"
                            class="bg-white rounded-md border border-border p-4 group"
                        >
                            <summary class="cursor-pointer list-none flex justify-between items-center text-sm text-secondary">
                                <span>{{ item.q }}</span>
                                <span class="text-primary text-lg group-open:rotate-45 transition-transform ms-3">+</span>
                            </summary>
                            <p class="mt-3 text-primary/80 text-sm leading-relaxed">
                                {{ item.a }}
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const groups = [
    {
        title: 'For Owners',
        items: [
            { q: 'How often do I receive reports?', a: 'Monthly financial reports and quarterly performance reviews, with real-time access via our digital portal.' },
            { q: 'What fees do you charge?', a: 'Transparent and competitive, typically a percentage of collected rent. Contact us for a tailored proposal.' },
            { q: 'How do you handle non-payment?', a: 'Structured escalation process from reminders through legal channels when necessary.' },
        ],
    },
    {
        title: 'For Tenants',
        items: [
            { q: 'How fast are maintenance requests handled?', a: 'Emergency within 2 hours. Standard maintenance within 24-48 hours.' },
            { q: 'Is there an emergency line?', a: 'Yes, 24/7 emergency hotline for all tenants.' },
            { q: 'Can I renew digitally?', a: 'Absolutely. Our platform supports seamless contract renewals.' },
        ],
    },
]
</script>

<style>
details > summary::-webkit-details-marker { display: none; }
</style>
