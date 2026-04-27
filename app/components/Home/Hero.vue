<template>
    <div>
        <div class="font-bg h-max md:h-[100svh] w-full relative">
            <div class="relative md:absolute md:inset-0 h-full w-full flex items-center  justify-center max-w-[1350px] mx-auto px-4 py-20 md:py-0">
                <div class="flex w-full md:mt-20  flex-col items-center z-10">
                    <motion.div
                        class="text-center text-white w-full md:w-[60%]"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }"
                    >
                        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Find Your Place in Jordan’s Finest</h1>
                    </motion.div>
                    <motion.p
                        class="text-white text-center mt-6 md:mt-10 w-full md:w-[60%] text-base md:text-lg font-light"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }"
                    >
                        Discover exclusive properties in Amman, Aqaba, and the Dead Sea. Luxury living tailored to your
                        lifestyle.
                    </motion.p>

                    <motion.div
                        class="w-full md:w-[80%] h-max bg-background mt-8 md:mt-15 p-4 md:p-6 rounded-lg"
                        :initial="{ opacity: 0, y: 28 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }"
                    >
                        <div class="w-full gap-2 h-full flex flex-wrap">
                            <Button
                                v-for="tab in tabs"
                                :key="tab"
                                size="lg"
                                :class="[
                                    'rounded-full',
                                    activeTab === tab
                                        ? ''
                                        : 'text-secondary/70 bg-transparent hover:text-secondary hover:bg-primary/8'
                                ]"
                                @click="activeTab = tab"
                            >
                                {{ tab }}
                            </Button>
                        </div>
                        <hr class="mt-4 !border-secondary/10">
                        <div class="flex flex-col md:flex-row py-4 gap-3">
                            <Select>
                                <SelectTrigger
                                    class="w-full md:flex-1 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none">
                                    <div class="flex items-center gap-3">
                                        <LucideMapPin class="text-primary" />
                                        <SelectValue placeholder="Select a fruit" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger
                                    class="w-full md:flex-1 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none">
                                    <div class="flex items-center gap-3">
                                        <LucideBuilding2 class="text-primary" />
                                        <SelectValue placeholder="Select a fruit" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input placeholder="Keywords or Reference" class="w-full md:flex-1 placeholder:text-primary/80 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none" />

                            <div class="flex gap-3 w-full md:w-auto">
                                <Button size="lg" class="flex-1 md:flex-none py-5.5 md:aspect-square rounded-lg bg-primary/10 text-primary border hover:bg-primary/20"> <LucideFilter /></Button>
                                <Button size="lg" class="flex-1 md:flex-none py-5.5 md:!aspect-square rounded-lg"> <LucideSearch /></Button>
                            </div>

                        </div>
                        <hr class=" !border-secondary/10">
                        <div class="flex flex-col md:flex-row mt-4 gap-2 md:gap-6 text-sm">
                            <div class="text-secondary/50">
                                Popular:
                            </div>
                            <div class="flex flex-wrap gap-3 md:gap-6">
                               <div class="text-primary underline">
                                Abdoun Villas
                               </div>
                               <div class="text-primary underline">
                               Dabouq Estates
                               </div>
                               <div class="text-primary underline">
                                Abdali Apartments
                               </div>

                            </div>

                        </div>
                    </motion.div>

                    <div class="w-full md:w-[60%] flex gap-3 md:gap-5 mt-8 md:mt-15 h-full ">
                        <motion.div
                            v-for="(s, i) in stats"
                            :key="s.label"
                            class="w-full text-center flex flex-col gap-2 h-full"
                            :initial="{ opacity: 0, y: 28 }"
                            :animate="{ opacity: 1, y: 0 }"
                            :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.15 }"
                        >
                            <div class="text-2xl md:text-4xl text-white font-bold">
                                <DefaultCountUp :to="s.value" :suffix="s.suffix" />
                            </div>
                            <div class="text-xs md:text-base text-white/80">
                                {{ s.label }}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            <video src="/videos/hero.mp4" class="w-full h-full object-cover absolute inset-0" autoplay muted loop playsinline></video>
            <div class="absolute bg-gradient-to-b from-black/70 via-black/20 to-black/70 inset-0 z-0"></div>


        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { motion } from 'motion-v'
import Button from '../ui/button/Button.vue';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Input from '../ui/input/Input.vue';

const tabs = ['Buy', 'Rent', 'Commercial', 'Industrial']
const activeTab = ref('Buy')

const stats = [
    { value: 15, suffix: '+', label: 'Years of Experience' },
    { value: 200, suffix: '+', label: 'Properties Sold' },
    { value: 98, suffix: '%', label: 'Client Satisfaction' },
]
</script>

<style scoped></style>