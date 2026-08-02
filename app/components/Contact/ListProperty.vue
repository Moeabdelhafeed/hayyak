<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                <div class="flex flex-col gap-8">
                    <div>
                        <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">{{ t('contact_list_title') }}</h2>
                        <p class="text-primary/80 text-sm leading-relaxed mt-3">{{ t('contact_list_body') }}</p>
                    </div>

                    <div class="bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-5">
                        <h3 class="font-display text-secondary text-base font-bold">{{ t('contact_list_why_title') }}</h3>
                        <ul class="flex flex-col gap-2 mt-4">
                            <li v-for="point in whyPoints" :key="point" class="flex items-start gap-2 text-secondary/80 text-sm">
                                <LucideCheck class="size-4 text-brand-turquoise mt-0.5 shrink-0" />
                                {{ point }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 border border-border">
                    <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">{{ t('contact_list_form_title') }}</h2>
                    <p class="text-primary/80 text-sm mt-2">{{ t('contact_list_form_body') }}</p>

                    <p v-if="submitMsg" :class="submitOk ? 'text-green-600' : 'text-red-600'" class="text-sm mt-3">{{ submitMsg }}</p>
                    <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" @submit.prevent="onSubmit">
                        <div>
                            <label :class="labelClass">{{ t('contact_form_name') }}</label>
                            <Input v-model="form.name" required maxlength="255" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_email_label') }}</label>
                            <Input v-model="form.email" type="email" maxlength="255" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_mobile') }}</label>
                            <Input v-model="form.phone" dir="ltr" maxlength="20" placeholder="+962 7X XXX XXXX" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_unit_type_label') }}</label>
                            <Select v-model="form.unit_type">
                                <SelectTrigger :class="[inputClass, 'flex items-center justify-between']">
                                    <SelectValue :placeholder="t('contact_form_select_placeholder')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="opt in unitTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label :class="labelClass">{{ t('contact_form_location_label') }}</label>
                            <Select v-model="form.area_id">
                                <SelectTrigger :class="[inputClass, 'flex items-center justify-between']">
                                    <SelectValue :placeholder="t('contact_form_select_placeholder')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="opt in areaOptions" :key="opt.id" :value="String(opt.id)">{{ opt.name }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_location_text_label') }}</label>
                            <Input v-model="form.location_text" maxlength="255" :class="inputClass" />
                        </div>

                        <div>
                            <label :class="labelClass">{{ t('contact_form_bedrooms_label') }}</label>
                            <Input v-model="form.bedrooms" type="number" min="0" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_bathrooms_label') }}</label>
                            <Input v-model="form.baths" type="number" min="0" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_floor_label') }}</label>
                            <Input v-model="form.floor" type="number" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_garden_label') }}</label>
                            <Select v-model="form.private_garden">
                                <SelectTrigger :class="[inputClass, 'flex items-center justify-between']">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no">{{ t('contact_form_no') }}</SelectItem>
                                    <SelectItem value="yes">{{ t('contact_form_yes') }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label :class="labelClass">{{ t('contact_form_size_label') }}</label>
                            <Input v-model="form.size_sqft" type="number" min="0" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_max_area_label') }}</label>
                            <Input v-model="form.max_area_size" type="number" min="0" :class="inputClass" />
                        </div>

                        <div>
                            <label :class="labelClass">{{ t('contact_form_value_label') }}</label>
                            <Input v-model="form.value" type="number" min="0" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_closing_date_label') }}</label>
                            <Input v-model="form.closing_date" type="date" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_budget_min') }}</label>
                            <Input v-model="form.budget_min" type="number" min="0" :class="inputClass" />
                        </div>
                        <div>
                            <label :class="labelClass">{{ t('contact_form_budget_max') }}</label>
                            <Input v-model="form.budget_max" type="number" min="0" :class="inputClass" />
                        </div>

                        <div class="sm:col-span-2">
                            <label :class="labelClass">{{ t('contact_form_description_label') }}</label>
                            <textarea v-model="form.description" rows="3" :class="[inputClass, 'resize-none py-3']" />
                        </div>
                        <div class="sm:col-span-2">
                            <label :class="labelClass">{{ t('contact_form_additional_details') }}</label>
                            <textarea v-model="form.message" rows="3" :class="[inputClass, 'resize-none py-3']" />
                        </div>

                        <div class="sm:col-span-2">
                            <button
                                type="submit"
                                :disabled="submitting"
                                class="inline-flex items-center gap-2 px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,91,0,0.45)] transition-all text-sm disabled:opacity-60 font-medium"
                            >
                                {{ submitting ? t('contact_form_sending') : t('contact_form_send_button') }}
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
import { reactive, ref, computed } from 'vue'
import Select from '../ui/select/Select.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectValue from '../ui/select/SelectValue.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'

const inputClass = 'w-full bg-white !ring-0 rounded-lg py-5.5 border border-border !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const labelClass = 'block text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data: areasRes } = await useFetch('/api/areas', { watch: [locale], key: `list-areas-${locale.value}` })
const areaOptions = computed(() =>
    [...(areasRes.value?.data ?? [])].sort((a, b) =>
        String(a?.name ?? '').localeCompare(String(b?.name ?? ''), locale.value, { sensitivity: 'base' }))
)

const { data: typesRes } = await useFetch('/api/units/types', { watch: [locale], key: `list-unit-types-${locale.value}` })
const unitTypeOptions = computed(() =>
    (typesRes.value?.data ?? []).map(ty => ({ value: ty.value, label: ty.name }))
)

const whyPoints = computed(() => [
    t('contact_list_why_1'),
    t('contact_list_why_2'),
    t('contact_list_why_3'),
])

const form = reactive({
    form_type: 'list_property',
    name: '',
    email: '',
    phone: '',
    unit_type: '',
    area_id: '',
    location_text: '',
    bedrooms: '',
    baths: '',
    floor: '',
    private_garden: 'no',
    size_sqft: '',
    max_area_size: '',
    value: '',
    closing_date: '',
    budget_min: '',
    budget_max: '',
    description: '',
    message: '',
})

const submitting = ref(false)
const submitMsg = ref('')
const submitOk = ref(false)

const splitName = (full) => {
    const parts = String(full || '').trim().split(/\s+/)
    return { first_name: parts[0] || '', last_name: parts.slice(1).join(' ') || parts[0] || '' }
}
const num = (v) => (v === '' || v == null ? undefined : Number(v))
const str = (v) => (String(v ?? '').trim() || undefined)

const flattenErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return ''
    return Object.values(errors).flat().filter(Boolean).join(' ')
}

const onSubmit = async () => {
    submitMsg.value = ''
    submitOk.value = false

    if (!form.email.trim() && !form.phone.trim()) {
        submitMsg.value = t('property_sidebar_contact_required')
        return
    }
    if (form.email.trim() && !isValidEmail(form.email)) {
        submitMsg.value = t('form_invalid_email', 'Please enter a valid email address.')
        return
    }
    if (form.phone.trim() && !isValidPhone(form.phone)) {
        submitMsg.value = t('form_invalid_phone', 'Please enter a valid phone number.')
        return
    }

    const bMin = num(form.budget_min)
    const bMax = num(form.budget_max)
    if (bMin != null && bMax != null && bMax < bMin) {
        submitMsg.value = t('contact_form_budget_invalid')
        return
    }

    submitting.value = true
    try {
        const { first_name, last_name } = splitName(form.name)
        const body = {
            first_name,
            last_name,
            email: str(form.email),
            phone: str(form.phone),
            country_code: '+962',
            form_type: form.form_type,
            lead_type: form.form_type,
            source: 'Website',
            originating_url: typeof window !== 'undefined' ? window.location.href : undefined,
            unit_type: str(form.unit_type),
            area_id: num(form.area_id),
            location_text: str(form.location_text),
            bedrooms: num(form.bedrooms),
            baths: num(form.baths),
            floor: num(form.floor),
            private_garden: form.private_garden === 'yes',
            size_sqft: num(form.size_sqft),
            max_area_size: num(form.max_area_size),
            value: num(form.value),
            closing_date: str(form.closing_date),
            budget_min: num(form.budget_min),
            budget_max: num(form.budget_max),
            description: str(form.description),
            message: str(form.message),
        }

        await $fetch('/api/leads', { method: 'POST', body })

        submitOk.value = true
        submitMsg.value = t('contact_form_success')
        Object.assign(form, {
            name: '', email: '', phone: '', unit_type: '', area_id: '', location_text: '',
            bedrooms: '', baths: '', floor: '', private_garden: 'no', size_sqft: '', max_area_size: '',
            value: '', closing_date: '', budget_min: '', budget_max: '', description: '', message: '',
        })
    } catch (e) {
        submitOk.value = false
        submitMsg.value = flattenErrors(e?.data?.errors) || e?.data?.message || t('contact_form_error')
    } finally {
        submitting.value = false
    }
}
</script>
