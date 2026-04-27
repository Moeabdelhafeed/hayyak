<template>
    <aside class="lg:sticky lg:top-33 h-max flex flex-col gap-4">
        <div class="bg-white border border-border rounded-xl p-6">
            <p class="text-primary text-3xl font-bold mt-1">{{ property.currency }} {{ property.price }}</p>

            <div class="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" class="border-primary" as-child>
                    <a
                        href="tel:+96265555555"
                        class="text-secondary border-border hover:bg-primary hover:text-white hover:border-primary"
                    >
                        <LucidePhone class="size-4" />
                        Call
                    </a>
                </Button>
                <a
                    href="https://wa.me/96265555555"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center h-full justify-center gap-2 px-4 h-9 rounded-md bg-[#25d366] hover:bg-[#1da851] text-white transition-colors text-sm"
                >
                    <LucideMessageCircle class="size-4" />
                    WhatsApp
                </a>
            </div>
        </div>

        <div class="bg-white border border-border rounded-xl p-6">
            <h3 class="text-secondary text-base font-bold">Send an Enquiry</h3>
            <p class="text-primary text-xs mt-1">Our team will respond within 24 hours.</p>

            <form class="flex flex-col gap-5 mt-4" @submit.prevent>
                <div>
                    <label :class="labelClass">Full Name *</label>
                    <Input v-model="form.name" required placeholder="e.g. Ahmad Al-Khatib" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">Email Address *</label>
                    <Input v-model="form.email" type="email" required placeholder="you@email.com" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">Phone Number</label>
                    <Input v-model="form.phone" placeholder="+962 7X XXX XXXX" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">Message</label>
                    <textarea
                        v-model="form.message"
                        rows="3"
                        :placeholder="`I'm interested in ${property.reference}…`"
                        class="w-full px-3 py-2.5 bg-primary/7 rounded-lg !ring-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary resize-none"
                    />
                </div>
                <div class="flex flex-col gap-3">

                    <label class="flex items-center gap-2 text-secondary text-sm cursor-pointer">
                        <Checkbox v-model:model-value="form.viewing" />
                        I'd like to schedule a viewing
                    </label>
    
                    <Button class="w-full" type="submit">
                        <LucideMail class="size-4" />
                        Send Enquiry
                    </Button>
                    <Button variant="outline" type="button" class="w-full text-primary border-primary/30 hover:bg-primary hover:text-white">
                        <LucideCalendar class="size-4" />
                        Book a Viewing
                    </Button>
                </div>
            </form>
        </div>

        <div class="bg-white border items-center border-border rounded-lg p-6 flex  gap-3">
            <div class="h-full p-4 aspect-square rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <LucideBuilding2 class="size-5 text-primary" />
            </div>
            <div class="min-w-0">
                <p class="text-secondary text-sm font-semibold">Hayyak Property Management</p>
                <p class="text-primary text-xs mt-1">+962 6 XXX XXXX</p>
                <p class="text-primary text-xs">info@hayyak.jo</p>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { reactive } from 'vue'
import Checkbox from '../ui/checkbox/Checkbox.vue'

defineProps({
    property: { type: Object, required: true },
})

const inputClass = 'w-full bg-primary/7  !ring-0 rounded-lg !border-0 py-5 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary'
const labelClass = 'block !text-xs uppercase tracking-wider text-primary font-medium mb-1.5'

const form = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
    viewing: false,
})
</script>
