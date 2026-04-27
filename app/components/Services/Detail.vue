<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto flex flex-col gap-16 md:gap-20">
            <div
                v-for="(service, idx) in services"
                :key="service.title"
                class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
                <div :class="idx % 2 === 0 ? 'lg:order-2' : ''">
                    <div class="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center">
                        <component :is="service.icon" class="size-5 text-primary" />
                    </div>
                    <h2 class="text-secondary text-2xl md:text-3xl mt-5 font-bold">{{ service.title }}</h2>
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
                </div>
                <div :class="['relative rounded-lg overflow-hidden h-72 sm:h-96', idx % 2 === 0 ? 'lg:order-1' : '']">
                    <img :src="service.img" :alt="service.title" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import {
    LucideWrench, LucideFileText, LucideUsers,
    LucideTag, LucideFileSignature, LucideStore,
    LucideTrendingUp, LucideSearch, LucideShield,
    LucideLightbulb, LucideBarChart3, LucideLayoutGrid,
    LucideBuilding2, LucideKeyRound, LucideHandshake, LucideClipboardCheck,
} from 'lucide-vue-next'

const services = [
    {
        icon: LucideBuilding2,
        title: 'Property Management',
        tag: 'The Core Pulse of Your Asset.',
        desc: 'Our management philosophy transitions your property from a static expense to a dynamic investment. We utilize a tech-enabled platform to provide total transparency and operational excellence.',
        bullets: [
            { icon: LucideWrench, text: 'Preventive maintenance — systematic asset protection' },
            { icon: LucideFileText, text: 'Financial reporting — institutional-grade, rent collection, budget management' },
            { icon: LucideUsers, text: 'Tenant relations — high-standard hospitality and community management' },
        ],
        img: 'https://images.unsplash.com/photo-1715985160053-d339e8b6eb94?auto=format&fit=crop&w=1200&q=80',
    },
    {
        icon: LucideKeyRound,
        title: 'Rentals & Leasing',
        tag: 'Maximizing Occupancy and Yield.',
        desc: 'We utilize deep market intelligence to position your property effectively, ensuring we attract and retain the right tenant mix.',
        bullets: [
            { icon: LucideTag, text: 'Strategic pricing and marketing to minimize vacancy periods' },
            { icon: LucideFileSignature, text: 'Streamlined digital leasing and onboarding' },
            { icon: LucideStore, text: 'Specialized strategies for commercial and residential' },
        ],
        img: 'https://images.unsplash.com/photo-1757264119016-7e6b568b810d?auto=format&fit=crop&w=1200&q=80',
    },
    {
        icon: LucideHandshake,
        title: 'Sales & Acquisitions',
        tag: 'Strategic Transactions with Confidence.',
        desc: "Leveraging our unique relationship with Jordan's largest financial institutions, we offer a secure platform for real estate transactions.",
        bullets: [
            { icon: LucideTrendingUp, text: 'Asset disposition — maximizing value through targeted investor reach' },
            { icon: LucideSearch, text: 'Investment sourcing — identifying high-potential opportunities' },
            { icon: LucideShield, text: 'Full legal and financial compliance at every stage' },
        ],
        img: 'https://images.unsplash.com/photo-1604157885654-5e2891bfacbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
        icon: LucideClipboardCheck,
        title: 'Consultancy & Advisory',
        tag: 'Vision Grounded in Data.',
        desc: 'Our advisory team provides the insight required to make high-stakes real estate decisions with confidence.',
        bullets: [
            { icon: LucideLightbulb, text: 'Highest & best use studies — most profitable development path' },
            { icon: LucideBarChart3, text: 'Market analysis — feasibility studies and trend forecasting' },
            { icon: LucideLayoutGrid, text: 'Portfolio strategy — restructuring and optimization' },
        ],
        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    },
]
</script>
