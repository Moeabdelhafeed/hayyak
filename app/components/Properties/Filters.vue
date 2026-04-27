<template>
    <aside class="bg-white border border-border rounded-lg p-5 lg:sticky lg:top-33 h-max">
        <h3 class="text-secondary text-lg font-bold">Filters</h3>

        <div class="mt-5 relative">
            <LucideSearch class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Input
                v-model="search"
                placeholder="Keyword or reference..."
                :class="inputClass"
            />
        </div>

        <div class="mt-3 relative">
            <LucideMapPin class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="location">
                <SelectTrigger :class="triggerClass">
                    <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="o in locations" :key="o" :value="o">{{ o }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3 relative">
            <LucideBuilding2 class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="type">
                <SelectTrigger :class="triggerClass">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="o in types" :key="o" :value="o">{{ o }}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-3 relative">
            <LucideBed class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="bedrooms">
                <SelectTrigger :class="triggerClass">
                    <SelectValue placeholder="Any Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="n in bedroomOptions" :key="n" :value="n">{{ n }} Bedrooms</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mt-5">
            <p class="text-xs uppercase tracking-[0.15em] text-primary font-medium">Price (JOD)</p>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <Input
                    v-model="priceMin"
                    type="number"
                    placeholder="Min"
                    :class="priceInputClass"
                />
                <Input
                    v-model="priceMax"
                    type="number"
                    placeholder="Max"
                    :class="priceInputClass"
                />
            </div>
        </div>

        <div class="mt-5 relative">
            <LucideArrowDownUp class="size-4 text-primary absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="sort">
                <SelectTrigger :class="triggerClass">
                    <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue'

const triggerClass = 'w-full ps-9 pe-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary data-[placeholder]:text-secondary'
const inputClass = 'w-full ps-9 pe-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const priceInputClass = 'w-full px-3 bg-primary/7 !ring-0 rounded-lg py-5.5 !border-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'

const search = ref('')
const location = ref('')
const type = ref('')
const bedrooms = ref('')
const priceMin = ref('')
const priceMax = ref('')
const sort = ref('newest')

const bedroomOptions = ['1', '2', '3', '4', '5', '6+']
const locations = ['Abdoun', 'Dabouq', 'Abdali', 'Deir Ghbar', 'Shmeisani', 'Aqaba', 'Sweifieh']
const types = ['Apartment', 'Villa', 'Penthouse', 'Studio', 'Office', 'Commercial', 'Land']
</script>
