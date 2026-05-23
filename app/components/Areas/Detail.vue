<template>
    <section class="pt-8 md:pt-10 pb-12 md:pb-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto flex flex-col gap-8 md:gap-10">
            <div
                v-for="area in cards"
                :key="area.id"
                :id="area.slug"
                class="bg-white rounded-lg border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-2 scroll-mt-32"
            >
                <div class="relative h-72 lg:h-auto min-h-[320px]">
                    <img :src="area.img" :alt="area.title" class="absolute inset-0 w-full h-full object-cover">
                </div>

                <div class="p-6 md:p-8">
                    <div>
                        <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ area.title }}</h2>
                        <p v-if="area.city" class="text-brand-turquoise text-sm mt-1 flex items-center gap-1.5">
                            <LucideMapPin class="size-3.5" />
                            {{ area.city }}
                        </p>
                    </div>

                    <p class="text-brand-turquoise/80 text-sm leading-relaxed mt-4">{{ area.desc }}</p>

                    <div class="border-t border-border mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideUtensils class="size-3.5" />
                                {{ t('areas_detail_dining') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.dining" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideShoppingBag class="size-3.5" />
                                {{ t('areas_detail_shopping') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.shopping" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideLandmark class="size-3.5" />
                                {{ t('areas_detail_landmarks') }}
                            </h4>
                            <ul class="flex flex-col gap-2 mt-3">
                                <li v-for="item in area.landmarks" :key="item" class="flex items-start gap-2 text-sm text-secondary/90">
                                    <span class="text-brand-turquoise mt-1 text-xs">●</span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-display flex items-center gap-2 text-xs text-brand-turquoise uppercase tracking-wider font-medium">
                                <LucideHouse class="size-3.5" />
                                {{ t('areas_detail_practical') }}
                            </h4>
                            <p class="text-sm text-secondary/90 leading-relaxed mt-3">{{ area.practical }}</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <NuxtLink
                            :to="{ name: 'properties', query: { area_id: area.id } }"
                            class="inline-flex items-center gap-2 text-sm text-brand-turquoise hover:underline"
                        >
                            {{ t('areas_detail_view_properties_in') }} {{ area.title }}
                            <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data: areasRes } = await useFetch('/api/areas', {
    watch: [locale],
    key: `areas-detail-${locale.value}`,
})

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1764562155616-facdda23671a?auto=format&fit=crop&w=1200&q=80'
const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const staticContent = {
    en: [
        {
            desc: "A prestigious residential and diplomatic hub with embassy compounds and a cosmopolitan social scene. Direct Airport Road access and top international schools nearby.",
            practical: "Premium pricing. Studios from $600/month, luxury villas to $4,500+/month. 25-30 min to Queen Alia Airport.",
            dining: ["Blue Fig — all-day dining and weekend brunch", "Salt Steakhouse at Fairmont — premium steaks", "The Matcha Club — trending health spot"],
            shopping: ["Taj Lifestyle Centre — luxury mall", "Boutique stores and gourmet groceries"],
            landmarks: ["Iconic cable-stayed bridge", "Serene green parks"],
        },
        {
            desc: "Suburban luxury enclave with sprawling estates, gated compounds, and a pine-scented breeze. Most exclusive residential neighbourhood in the city.",
            practical: "Largely residential, buildings limited to 3-4 stories. Exceptionally safe due to proximity to royal residences.",
            dining: ["The Village — lifestyle outlets cluster", "L'Incontro — authentic Italian", "Nairu — sophisticated Pan-Asian"],
            shopping: ["The Village commercial complex", "Boutique designer stores"],
            landmarks: ["Pine-scented residential streets", "Royal compound proximity"],
        },
        {
            desc: "Modern central business district with high-rise residential towers, the Boulevard, and the country's most prominent commercial developments.",
            practical: "Mix of residential and commercial. Modern apartments with hotel-style amenities. Central location with easy access to all of the city.",
            dining: ["The Boulevard restaurants strip", "International chains and local favourites", "Rooftop bars and cafés"],
            shopping: ["The Boulevard retail district", "Abdali Mall"],
            landmarks: ["Abdali Boulevard", "Rotana Hotel Tower"],
        },
        {
            desc: "A unique destination combining tourism, special economic zone benefits, and year-round sunshine. Strong investment potential.",
            practical: "Special economic zone with tax advantages. Year-round sunshine. Direct flights to major Gulf and European cities.",
            dining: ["Seaside fine dining", "Resort restaurants", "Traditional seafood spots"],
            shopping: ["Marina shops", "City mall"],
            landmarks: ["Red Sea coastline", "Historic fort"],
        },
    ],
    ar: [
        {
            desc: "حي سكني ودبلوماسي راقٍ يضم مقار السفارات ومشهداً اجتماعياً عالمياً. وصول مباشر لطريق المطار وقرب من أرقى المدارس الدولية.",
            practical: "تسعير مرتفع. ستوديوهات تبدأ من 600 دولار شهرياً، فلل فاخرة حتى 4500+ دولار شهرياً. 25-30 دقيقة لمطار الملكة علياء.",
            dining: ["بلو فيغ — مطعم نهاري وبرانش", "صولت ستيك هاوس في فيرمونت — ستيك فاخر", "ذا ماتشا كلوب — وجهة صحية رائجة"],
            shopping: ["تاج لايف ستايل سنتر — مول فاخر", "بوتيكات ومتاجر بقالة راقية"],
            landmarks: ["جسر معلق أيقوني", "حدائق هادئة"],
        },
        {
            desc: "ضاحية فاخرة فيها فلل واسعة ومجمعات سكنية مغلقة ونسيم منعش بين الصنوبر. أرقى الأحياء السكنية في المدينة.",
            practical: "سكني بالكامل تقريباً، المباني محدودة بـ 3-4 طوابق. آمن جداً لقربه من المقار الملكية.",
            dining: ["ذا فيليج — تجمع وجهات", "إنكونترو — إيطالي أصيل", "نايرو — آسيوي راقٍ"],
            shopping: ["مجمع ذا فيليج التجاري", "متاجر مصممين"],
            landmarks: ["شوارع سكنية بين الصنوبر", "قرب من القصور الملكية"],
        },
        {
            desc: "مركز أعمال حديث مع أبراج سكنية شاهقة والبوليفارد وأبرز المشاريع التجارية في البلاد.",
            practical: "مزيج سكني وتجاري. شقق حديثة بخدمات فندقية. موقع مركزي مع وصول سهل لجميع أنحاء المدينة.",
            dining: ["مطاعم البوليفارد", "سلاسل عالمية ومحلية", "حانات وكافيهات على الأسطح"],
            shopping: ["منطقة البوليفارد التجارية", "مول العبدلي"],
            landmarks: ["بوليفارد العبدلي", "برج فندق روتانا"],
        },
        {
            desc: "وجهة فريدة تجمع بين السياحة ومزايا المنطقة الاقتصادية الخاصة والشمس على مدار العام. إمكانات استثمارية قوية.",
            practical: "منطقة اقتصادية خاصة بمزايا ضريبية. شمس على مدار العام. رحلات مباشرة لمدن الخليج وأوروبا.",
            dining: ["مطاعم فاخرة على البحر", "مطاعم المنتجعات", "أكلات البحر التقليدية"],
            shopping: ["متاجر المرسى", "سيتي مول"],
            landmarks: ["ساحل البحر الأحمر", "القلعة التاريخية"],
        },
    ],
}

const cards = computed(() => {
    const apiList = (areasRes.value?.data ?? []).slice(0, 4)
    const content = staticContent[locale.value] || staticContent.en
    return content.map((c, i) => {
        const api = apiList[i] || {}
        return {
            id: api.id ?? i + 1,
            slug: slugify(api.name || `area-${i + 1}`),
            title: api.name || '',
            city: api.city?.name || '',
            img: api.image || FALLBACK_IMG,
            ...c,
        }
    })
})
</script>
