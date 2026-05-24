<template>
    <aside class="lg:sticky lg:top-33 h-max flex flex-col gap-4">
        <div class="bg-gradient-to-br from-brand-turquoise/8 to-white border border-brand-turquoise/20 rounded-xl p-6">
            <p class="text-brand-orange text-3xl font-bold mt-1">{{ property.currency }} {{ property.price }}</p>

            <div class="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" class="border-brand-turquoise/40 text-brand-turquoise" as-child>
                    <a
                        href="tel:+96265555555"
                        class="text-brand-turquoise hover:bg-brand-turquoise hover:text-white hover:border-brand-turquoise"
                    >
                        <LucidePhone class="size-4" />
                        {{ t('property_sidebar_call') }}
                    </a>
                </Button>
                <a
                    href="https://wa.me/96265555555"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center h-full justify-center gap-2 px-4 h-9 rounded-md bg-[#25d366] hover:bg-[#1da851] text-white transition-colors text-sm"
                >
                    <LucideMessageCircle class="size-4" />
                    {{ t('property_sidebar_whatsapp') }}
                </a>
            </div>
        </div>

        <div class="bg-white border border-brand-turquoise/15 rounded-xl p-6">
            <h3 class="font-display text-secondary text-base font-bold">{{ t('property_sidebar_send_enquiry_title') }}</h3>
            <p class="text-brand-turquoise text-xs mt-1">{{ t('property_sidebar_response_time') }}</p>

            <p v-if="submitMsg" :class="submitOk ? 'text-green-600' : 'text-red-600'" class="text-xs mt-3">{{ submitMsg }}</p>
            <form class="flex flex-col gap-5 mt-4" @submit.prevent="onSubmit">
                <div>
                    <label :class="labelClass">{{ t('contact_form_enquiry_type_label') }}</label>
                    <Select v-model="form.form_type">
                        <SelectTrigger :class="inputClass">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="buy">{{ t('contact_form_enquiry_buy') }}</SelectItem>
                            <SelectItem value="rent">{{ t('contact_form_enquiry_rent') }}</SelectItem>
                            <SelectItem value="other">{{ t('contact_form_enquiry_other') }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label :class="labelClass">{{ t('property_sidebar_full_name') }}</label>
                    <Input v-model="form.name" required :placeholder="t('property_sidebar_full_name_placeholder')" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">{{ t('property_sidebar_email') }}</label>
                    <Input v-model="form.email" type="email" required :placeholder="t('property_sidebar_email_placeholder')" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">{{ t('property_sidebar_phone') }}</label>
                    <Input v-model="form.phone" :placeholder="t('property_sidebar_phone_placeholder')" :class="inputClass" />
                </div>
                <div>
                    <label :class="labelClass">{{ t('property_sidebar_message') }}</label>
                    <textarea
                        v-model="form.message"
                        rows="3"
                        :placeholder="`I'm interested in ${property.reference}…`"
                        class="w-full px-3 py-2.5 bg-primary/7 rounded-lg !ring-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary resize-none"
                    />
                </div>
                <Button :disabled="submitting" class="w-full bg-brand-turquoise text-white hover:bg-brand-turquoise/90 hover:shadow-[0_0_18px_rgba(0,106,114,0.5)] transition-all disabled:opacity-60" type="submit">
                    <LucideMail class="size-4" />
                    {{ submitting ? t('contact_form_sending') : t('property_sidebar_send_button') }}
                </Button>
            </form>
        </div>

        <div class="bg-white border items-center border-brand-turquoise/15 rounded-lg p-6 flex gap-3">
            <div class="h-full p-4 aspect-square rounded-full bg-brand-turquoise/10 flex items-center justify-center shrink-0">
                <LucideBuilding2 class="size-5 text-brand-turquoise" />
            </div>
            <div class="min-w-0">
                <p class="text-secondary text-sm font-semibold">{{ t('property_sidebar_company_name') }}</p>
                <p class="text-brand-turquoise text-xs mt-1">+962 6 XXX XXXX</p>
                <p class="text-brand-turquoise text-xs">info@hayyak.jo</p>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Select from '../ui/select/Select.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectValue from '../ui/select/SelectValue.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'

const { t } = useT()

const props = defineProps({
    property: { type: Object, required: true },
})

const defaultFormType = (variant) => {
    if (variant === 'sale') return 'buy'
    if (variant === 'rent') return 'rent'
    return 'other'
}

const inputClass = 'w-full bg-primary/7  !ring-0 rounded-lg !border-0 py-5 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary'
const labelClass = 'block !text-xs uppercase tracking-wider text-primary font-medium mb-1.5'

const form = reactive({
    form_type: defaultFormType(props.property.listingVariant),
    name: '',
    email: '',
    phone: '',
    message: '',
})

watch(() => props.property.listingVariant, (v) => {
    form.form_type = defaultFormType(v)
})

const submitting = ref(false)
const submitMsg = ref('')
const submitOk = ref(false)

const splitName = (full) => {
    const parts = String(full || '').trim().split(/\s+/)
    return { first_name: parts[0] || '', last_name: parts.slice(1).join(' ') || parts[0] || '' }
}

const onSubmit = async () => {
    submitting.value = true
    submitMsg.value = ''
    try {
        const { first_name, last_name } = splitName(form.name)
        await $fetch('/api/leads', {
            method: 'POST',
            body: {
                first_name,
                last_name,
                email: form.email,
                phone: form.phone,
                form_type: form.form_type,
                lead_type: form.form_type === 'rent' ? 'Lease' : 'Sales',
                source: 'Website',
                property_id: props.property.property_id || undefined,
                unit_id: props.property.id || undefined,
                originating_url: typeof window !== 'undefined' ? window.location.href : '',
                message: form.message,
                bedrooms: Number(props.property.bedrooms) || undefined,
                baths: Number(props.property.bathrooms) || undefined,
                size_sqft: Number(props.property.area) || undefined,
                location_text: props.property.location || '',
            },
        })
        submitOk.value = true
        submitMsg.value = t('contact_form_success')
        Object.assign(form, { name: '', email: '', phone: '', message: '' })
    } catch (e) {
        submitOk.value = false
        submitMsg.value = e?.data?.message || 'Something went wrong. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>
