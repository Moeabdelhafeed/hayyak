<template>
    <aside class="lg:sticky lg:top-33 h-max flex flex-col gap-4">
        <div class="bg-white border border-brand-turquoise/20 rounded-xl p-6">
            <p class="text-brand-orange text-3xl font-bold mt-1">
                {{ property.currency }} {{ property.price }}
                <span v-if="property.isForRent" class="text-brand-orange/70 font-normal text-base">/mo</span>
            </p>
            <p v-if="property.deposit" class="text-brand-turquoise/80 text-xs mt-1">{{ t('property_sidebar_deposit') }}: {{ property.currency }} {{ property.deposit }}</p>

            <div v-if="settings.app_phone || whatsappDigits" class="grid grid-cols-2 gap-2 mt-4">
                <Button v-if="settings.app_phone" variant="outline" class="border-brand-turquoise/40 text-brand-turquoise" as-child>
                    <a
                        :href="`tel:${phoneDigits}`"
                        class="text-brand-turquoise hover:bg-brand-turquoise hover:text-white hover:border-brand-turquoise"
                    >
                        <LucidePhone class="size-4" />
                        {{ t('property_sidebar_call') }}
                    </a>
                </Button>
                <a
                    v-if="whatsappDigits"
                    :href="`https://wa.me/${whatsappDigits}`"
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
                            <SelectItem value="sell">{{ t('contact_form_enquiry_sell') }}</SelectItem>
                            <SelectItem value="lease_out">{{ t('contact_form_enquiry_lease_out') }}</SelectItem>
                            <SelectItem value="property_management">{{ t('contact_form_enquiry_property_management') }}</SelectItem>
                            <SelectItem value="valuation">{{ t('contact_form_enquiry_valuation') }}</SelectItem>
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
                    <Input v-model="form.email" type="email" :placeholder="t('property_sidebar_email_placeholder')" :class="inputClass" />
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
                        :placeholder="t('property_sidebar_message_placeholder')"
                        class="w-full px-3 py-2.5 bg-primary/7 rounded-lg !ring-0 !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary resize-none"
                    />
                </div>
                <Button :disabled="submitting" class="w-full bg-brand-turquoise text-white hover:bg-brand-turquoise/90 hover:shadow-[0_0_18px_rgba(0,106,114,0.5)] transition-all disabled:opacity-60" type="submit">
                    <LucideMail class="size-4" />
                    {{ submitting ? t('contact_form_sending') : t('property_sidebar_send_button') }}
                </Button>
            </form>
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
const { settings, phoneDigits, whatsappDigits } = useSettings()

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

const flattenErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return ''
    return Object.values(errors).flat().filter(Boolean).join(' ')
}

// form_type → CRM lead_type bucket (per leads API)
const LEAD_TYPE = {
    buy: 'Sales', sell: 'Sales', valuation: 'Sales', other: 'Sales',
    rent: 'Lease', lease_out: 'Lease',
    property_management: 'PM',
}
// these form types describe the user's own property → free text goes in `description`, not `message`
const DESCRIPTION_TYPES = ['sell', 'lease_out', 'property_management', 'valuation']

const onSubmit = async () => {
    submitMsg.value = ''
    submitOk.value = false

    // contact = either email or phone is required
    if (!form.email.trim() && !form.phone.trim()) {
        submitMsg.value = t('property_sidebar_contact_required')
        return
    }

    submitting.value = true
    try {
        const { first_name, last_name } = splitName(form.name)
        const p = props.property
        const text = form.message.trim() || undefined

        const body = {
            first_name,
            last_name,
            email: form.email.trim() || undefined,
            phone: form.phone.trim() || undefined,
            country_code: '+962',
            form_type: form.form_type,
            lead_type: LEAD_TYPE[form.form_type] || 'Sales',
            source: 'Website',
            originating_url: typeof window !== 'undefined' ? window.location.href : undefined,
            // unit context (this sidebar is always about a specific unit)
            property_id: p.property_id || undefined,
            unit_id: p.id || undefined,
            bedrooms: p.bedrooms || undefined,
            baths: p.bathrooms || undefined,
            size_sqft: p.area || undefined,
            location_text: p.location || undefined,
        }
        if (DESCRIPTION_TYPES.includes(form.form_type)) body.description = text
        else body.message = text

        await $fetch('/api/leads', { method: 'POST', body })

        submitOk.value = true
        submitMsg.value = t('contact_form_success')
        Object.assign(form, { name: '', email: '', phone: '', message: '' })
    } catch (e) {
        submitOk.value = false
        submitMsg.value = flattenErrors(e?.data?.errors) || e?.data?.message || t('contact_form_error')
    } finally {
        submitting.value = false
    }
}
</script>
