<template>
    <section class="py-12 md:py-20 bg-[#f8fafb]">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="text-center mb-8 md:mb-10">
                <h2 class="text-secondary text-2xl md:text-3xl font-bold">Additional Services</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                <div
                    v-for="item in items"
                    :key="item.title"
                    class="bg-white p-6 rounded-lg border border-border hover:shadow-md transition-shadow h-full"
                >
                    <h3 class="text-secondary text-base font-medium">{{ item.title }}</h3>
                    <p class="text-primary/80 text-sm mt-2">{{ item.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const items = [
    { title: 'Residential Sales', desc: 'Apartments, villas, penthouses' },
    { title: 'Commercial Sales', desc: 'Offices, retail, warehouses' },
    { title: 'Land & Development', desc: 'Development plots and off-plan' },
    { title: 'Corporate & Embassy Leasing', desc: 'Specialized corporate solutions' },
    { title: 'Valuation Services', desc: 'Bank & mortgage valuations' },
    { title: 'Asset Management', desc: 'Portfolio strategy & income optimization' },
]
</script>
