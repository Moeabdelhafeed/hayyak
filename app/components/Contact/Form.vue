<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                <div class="flex flex-col gap-8">
                    <div>
                        <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">Get in Touch</h2>
                        <p class="text-primary/80 text-sm leading-relaxed mt-3">
                            Book a portfolio review or list your property with us. Our team is ready to help you optimize your real estate investments.
                        </p>
                    </div>

                    <div class="flex flex-col gap-5">
                        <div
                            v-for="info in contactInfo"
                            :key="info.label"
                            class="flex items-start gap-3"
                        >
                            <div class="w-10 h-10 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                                <component :is="info.icon" class="size-4 text-primary" />
                            </div>
                            <div>
                                <p class="text-primary text-xs uppercase tracking-[0.15em] font-medium">{{ info.label }}</p>
                                <component
                                    :is="info.href ? 'a' : 'p'"
                                    :href="info.href"
                                    class="text-secondary text-sm mt-1 block hover:text-primary transition-colors"
                                >
                                    {{ info.value }}
                                </component>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#f8fafb] border border-border rounded-lg p-5">
                        <h3 class="font-display text-secondary text-base font-bold">Quick Links</h3>
                        <ul class="flex flex-col gap-2 mt-4">
                            <li v-for="link in quickLinks" :key="link.label">
                                <NuxtLink
                                    :to="link.to"
                                    class="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm"
                                >
                                    <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                                    {{ link.label }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 border border-border">
                    <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">Enquiry Form</h2>
                    <p class="text-primary/80 text-sm mt-2">
                        Fill in the details below and we'll get back to you within 24 hours.
                    </p>

                    <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" @submit.prevent>
                        <div>
                            <label :class="labelClass">First Name *</label>
                            <Input v-model="form.firstName" required :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">Family Name *</label>
                            <Input v-model="form.familyName" required :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">Mobile *</label>
                            <Input v-model="form.phone" required placeholder="+962 7X XXX XXXX" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">Email *</label>
                            <Input v-model="form.email" type="email" required :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">Enquiry Type *</label>
                            <Select v-model="form.enquiryType" required>
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="o in enquiryOptions" :key="o.v" :value="o.v">{{ o.t }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Location</label>
                            <Select v-model="form.location">
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="o in locationOptions" :key="o" :value="o">{{ o }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Bedrooms</label>
                            <Select v-model="form.bedrooms">
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="n in ['1','2','3','4','5','6+']" :key="n" :value="n">{{ n }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Bathrooms</label>
                            <Select v-model="form.bathrooms">
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="n in ['1','2','3','4','5+']" :key="n" :value="n">{{ n }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Floor</label>
                            <Select v-model="form.floor">
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="G">Ground</SelectItem>
                                    <SelectItem v-for="n in ['1','2','3','4','5+']" :key="n" :value="n">{{ n }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Private Garden</label>
                            <Select v-model="form.garden">
                                <SelectTrigger :class="triggerClass">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">Budget Min (JOD)</label>
                            <Input v-model="form.budgetMin" type="number" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">Budget Max (JOD)</label>
                            <Input v-model="form.budgetMax" type="number" :class="inputClass" />
                        </div>
                        <div class="sm:col-span-2">
                            <label :class="labelClass">Additional Details</label>
                            <textarea v-model="form.message" rows="4" :class="[inputClass, 'resize-none py-3']" />
                        </div>
                        <div class="sm:col-span-2">
                            <button
                                type="submit"
                                class="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                            >
                                Send Enquiry
                                <LucideArrowRight class="size-4 rtl:rotate-180" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive } from 'vue'
import { LucideMapPin, LucidePhone, LucideMail, LucideClock } from 'lucide-vue-next'

const inputClass = 'w-full bg-white !ring-0 rounded-lg py-5.5 border border-border !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const triggerClass = 'w-full !h-auto bg-white !ring-0 rounded-lg py-3 border border-border !ring-offset-0 !shadow-none text-sm text-secondary data-[placeholder]:text-primary/80'
const labelClass = 'block text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2'

const contactInfo = [
    { icon: LucideMapPin, label: 'Office', value: 'Amman, Jordan' },
    { icon: LucidePhone, label: 'Phone', value: '+962 6 XXX XXXX', href: 'tel:+96265555555' },
    { icon: LucideMail, label: 'Email', value: 'info@hayyak.jo', href: 'mailto:info@hayyak.jo' },
    { icon: LucideClock, label: 'Working Hours', value: 'Sun-Thu: 9AM-6PM' },
]

const quickLinks = [
    { label: 'Download Company Profile', to: { name: 'home' } },
    { label: 'View Our Services', to: { name: 'services' } },
    { label: 'Explore Areas', to: { name: 'areas' } },
]

const enquiryOptions = [
    { v: 'buy', t: 'Buy' },
    { v: 'sell', t: 'Sell' },
    { v: 'rent', t: 'Rent' },
    { v: 'lease', t: 'Lease Out' },
    { v: 'management', t: 'Property Management' },
    { v: 'valuation', t: 'Valuation' },
    { v: 'other', t: 'Other' },
]

const locationOptions = ['Abdoun', 'Dabouq', 'Abdali', 'Deir Ghbar', 'Jabal Amman', 'Shmeisani', 'Aqaba', 'Dead Sea', 'Other']

const form = reactive({
    firstName: '',
    familyName: '',
    phone: '',
    email: '',
    enquiryType: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    garden: '',
    budgetMin: '',
    budgetMax: '',
    message: '',
})
</script>
