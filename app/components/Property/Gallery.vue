<template>
    <section class="relative bg-secondary pt-28">
        <div class="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
            <NuxtImg
                :key="'bg' + active"
                :src="images[active]"
                alt=""
                aria-hidden="true"
                sizes="xs:100vw sm:100vw md:100vw lg:66vw xl:66vw"
                class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
            />
            <div class="absolute inset-0 bg-black/70"></div>
            <Transition
                mode="out-in"
                enter-active-class="transition-opacity duration-300 ease-out"
                leave-active-class="transition-opacity duration-200 ease-in"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <NuxtImg
                    :key="active"
                    :src="images[active]"
                    :alt="title"
                    sizes="xs:100vw sm:100vw md:100vw lg:66vw xl:66vw"
                    loading="eager"
                    fetchpriority="high"
                    class="relative w-full h-full object-contain"
                />
            </Transition>

            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>

            <button
                class="absolute top-4 start-4 z-10 flex items-center gap-2 px-3 py-2 rounded-md bg-black/50 hover:bg-black/70 text-white text-sm transition-colors"
                @click="goBack"
            >
                <LucideArrowLeft class="size-4 rtl:rotate-180" />
                {{ t('common_back') }}
            </button>

            <div class="absolute top-4 end-4 z-10 flex items-center gap-2">
                <button
                    v-if="unitId"
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    :aria-label="t('favourites_toggle', 'Toggle favourite')"
                    @click="toggle(unitId)"
                >
                    <LucideHeart
                        class="size-4 transition-colors"
                        :class="isFavourite(unitId) ? 'fill-white text-white' : 'text-white'"
                    />
                </button>
                <button
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    :aria-label="t('common_share')"
                    @click="share"
                >
                    <LucideCheck v-if="shareCopied" class="size-4" />
                    <LucideShare2 v-else class="size-4" />
                </button>
                <button
                    class="flex items-center gap-2 px-3 h-10 rounded-md bg-black/50 hover:bg-black/70 text-white text-sm transition-colors"
                    @click="lightbox = true"
                >
                    <LucideMaximize2 class="size-4" />
                    {{ t('property_gallery_view_all_photos') }}
                </button>
            </div>

            <button
                class="absolute start-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                @click="prev"
                :aria-label="t('common_previous')"
            >
                <LucideChevronLeft class="size-5 rtl:rotate-180" />
            </button>
            <button
                class="absolute end-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                @click="next"
                :aria-label="t('common_next')"
            >
                <LucideChevronRight class="size-5 rtl:rotate-180" />
            </button>

            <div class="absolute bottom-4 end-4 z-10 px-3 py-1 rounded-md bg-black/50 text-white text-xs">
                {{ active + 1 }} / {{ images.length }}
            </div>
        </div>

        <div class="bg-secondary">
            <div class="max-w-[1350px] mx-auto px-4 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
                <button
                    v-for="(img, i) in images"
                    :key="i"
                    :class="[
                        'shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-colors',
                        active === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                    ]"
                    @click="active = i"
                >
                    <NuxtImg :src="img" :alt="title" loading="lazy" width="96" height="64" class="w-full h-full object-cover" />
                </button>
                <button
                    class="shrink-0 w-24 h-16 rounded-md border-2 border-dashed border-white/30 text-white/70 text-xs flex flex-col items-center justify-center hover:border-white hover:text-white transition-colors"
                    @click="lightbox = true"
                >
                    <LucideMaximize2 class="size-4" />
                    {{ t('common_all') }}
                </button>
            </div>
        </div>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="lightbox"
                    class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                    @click.self="lightbox = false"
                >
                    <button
                        class="absolute top-4 end-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        :aria-label="t('common_close')"
                        @click="lightbox = false"
                    >
                        <LucideX class="size-5" />
                    </button>

                    <div class="absolute top-4 start-4 z-10 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">
                        {{ active + 1 }} / {{ images.length }}
                    </div>

                    <button
                        class="absolute start-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        @click="prev"
                        :aria-label="t('common_previous')"
                    >
                        <LucideChevronLeft class="size-6 rtl:rotate-180" />
                    </button>
                    <button
                        class="absolute end-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        @click="next"
                        :aria-label="t('common_next')"
                    >
                        <LucideChevronRight class="size-6 rtl:rotate-180" />
                    </button>

                    <Transition
                        mode="out-in"
                        enter-active-class="transition-opacity duration-300 ease-out"
                        leave-active-class="transition-opacity duration-200 ease-in"
                        enter-from-class="opacity-0"
                        leave-to-class="opacity-0"
                    >
                        <img
                            :key="active"
                            :src="images[active]"
                            :alt="title"
                            class="max-w-[92vw] max-h-[85vh] object-contain"
                        >
                    </Transition>

                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-md bg-white/5 max-w-[92vw] overflow-x-auto scrollbar-hide">
                        <button
                            v-for="(img, i) in images"
                            :key="i"
                            :class="[
                                'shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-colors',
                                active === i ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                            ]"
                            @click="active = i"
                        >
                            <NuxtImg :src="img" width="64" height="48" loading="lazy" decoding="async" class="w-full h-full object-cover" :alt="title" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { LucideHeart } from 'lucide-vue-next'

const { t } = useT()
const { isFavourite, toggle } = useFavourites()

const props = defineProps({
    images: { type: Array, required: true },
    title: { type: String, default: '' },
    unitId: { type: [Number, String], default: null },
})

const router = useRouter()
const active = ref(0)
const lightbox = ref(false)
const shareCopied = ref(false)

const goBack = () => router.back()

const share = async () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    try {
        if (navigator.share) {
            await navigator.share({ title: props.title, url })
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url)
            shareCopied.value = true
            setTimeout(() => { shareCopied.value = false }, 2000)
        }
    } catch {
        // user dismissed the share sheet — no-op
    }
}
const next = () => { active.value = (active.value + 1) % props.images.length }
const prev = () => { active.value = (active.value - 1 + props.images.length) % props.images.length }

watch(lightbox, (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
})

// Keyboard: arrows navigate, Escape closes — only while the lightbox is open.
const onKey = (e) => {
    if (!lightbox.value) return
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'Escape') lightbox.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
