<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                <div class="flex flex-col gap-8">
                    <div>
                        <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">{{ t('contact_form_get_in_touch_title') }}</h2>
                        <p class="text-primary/80 text-sm leading-relaxed mt-3">
                            {{ t('contact_form_get_in_touch_body') }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-5">
                        <div
                            v-for="info in contactInfo"
                            :key="info.label"
                            class="flex items-start gap-3"
                        >
                            <div class="w-10 h-10 rounded-md bg-brand-turquoise/10 flex items-center justify-center shrink-0">
                                <component :is="info.icon" class="size-4 text-brand-turquoise" />
                            </div>
                            <div>
                                <p class="text-brand-turquoise text-xs uppercase tracking-[0.15em] font-medium">{{ info.label }}</p>
                                <component
                                    :is="info.href ? 'a' : 'p'"
                                    :href="info.href"
                                    :dir="info.dir"
                                    :target="info.external ? '_blank' : undefined"
                                    :rel="info.external ? 'noopener' : undefined"
                                    class="text-secondary text-sm mt-1 block hover:text-brand-turquoise transition-colors"
                                >
                                    {{ info.value }}
                                </component>
                            </div>
                        </div>
                    </div>

                    <div class="bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-lg p-5">
                        <h3 class="font-display text-secondary text-base font-bold">{{ t('contact_form_quick_links_title') }}</h3>
                        <ul class="flex flex-col gap-2 mt-4">
                            <li v-for="link in quickLinks" :key="link.label">
                                <NuxtLinkLocale
                                    :to="link.to"
                                    class="inline-flex items-center gap-2 text-brand-turquoise hover:text-secondary transition-colors text-sm"
                                >
                                    <LucideArrowRight class="size-3.5 rtl:rotate-180" />
                                    {{ link.label }}
                                </NuxtLinkLocale>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 border border-border">
                    <h2 class="font-display text-secondary text-xl md:text-2xl font-bold">{{ t('contact_form_enquiry_title') }}</h2>
                    <p class="text-primary/80 text-sm mt-2">
                        {{ t('contact_form_enquiry_body') }}
                    </p>

                    <p v-if="submitMsg" role="alert" :class="submitOk ? 'text-green-600' : 'text-red-600'" class="text-sm mt-3">{{ submitMsg }}</p>
                    <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" @submit.prevent="onSubmit">
                        <div class="sm:col-span-2">
                            <label for="contact-name" :class="labelClass">{{ t('contact_form_name') }}</label>
                            <Input id="contact-name" v-model="form.name" maxlength="255" aria-required="true" :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'contact-name-error' : undefined" :class="[inputClass, errors.name && errClass]" />
                            <p v-if="errors.name" id="contact-name-error" role="alert" :class="errMsgClass">{{ errors.name }}</p>
                        </div>
                        <div>
                            <label for="contact-email" :class="labelClass">{{ t('contact_form_email_label') }}</label>
                            <Input id="contact-email" v-model="form.email" type="email" maxlength="255" aria-required="true" :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'contact-email-error' : undefined" :class="[inputClass, errors.email && errClass]" />
                            <p v-if="errors.email" id="contact-email-error" role="alert" :class="errMsgClass">{{ errors.email }}</p>
                        </div>
                        <div>
                            <label for="contact-phone" :class="labelClass">{{ t('contact_form_mobile') }}</label>
                            <Input id="contact-phone" v-model="form.phone" dir="ltr" maxlength="20" placeholder="+962 7X XXX XXXX" aria-required="true" :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? 'contact-phone-error' : undefined" :class="[inputClass, errors.phone && errClass]" />
                            <p v-if="errors.phone" id="contact-phone-error" role="alert" :class="errMsgClass">{{ errors.phone }}</p>
                        </div>
                        <div class="sm:col-span-2">
                            <label for="contact-subject" :class="labelClass">{{ t('contact_form_subject') }}</label>
                            <Input id="contact-subject" v-model="form.subject" maxlength="255" aria-required="true" :aria-invalid="!!errors.subject" :aria-describedby="errors.subject ? 'contact-subject-error' : undefined" :class="[inputClass, errors.subject && errClass]" />
                            <p v-if="errors.subject" id="contact-subject-error" role="alert" :class="errMsgClass">{{ errors.subject }}</p>
                        </div>
                        <div class="sm:col-span-2">
                            <label for="contact-message" :class="labelClass">{{ t('contact_form_message_label') }}</label>
                            <textarea id="contact-message" v-model="form.message" rows="5" aria-required="true" :aria-invalid="!!errors.message" :aria-describedby="errors.message ? 'contact-message-error' : undefined" :class="[inputClass, 'resize-none py-3', errors.message && errClass]" />
                            <p v-if="errors.message" id="contact-message-error" role="alert" :class="errMsgClass">{{ errors.message }}</p>
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
import { reactive, ref, computed, watch } from 'vue'
import { LucideMapPin, LucidePhone, LucideMail, LucideClock } from 'lucide-vue-next'

const inputClass = 'w-full bg-white !ring-0 rounded-lg py-5.5 border border-border !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const labelClass = 'block text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2'
const errClass = '!border-red-500'
const errMsgClass = 'text-red-600 text-xs mt-1'

const { t } = useT()
const { settings, phoneDigits } = useSettings()

const contactInfo = computed(() => [
    settings.value.app_address && { icon: LucideMapPin, label: t('contact_form_info_office'), value: settings.value.app_address, href: settings.value.app_address_url || undefined, external: !!settings.value.app_address_url },
    settings.value.app_phone && { icon: LucidePhone, label: t('contact_form_info_phone'), value: settings.value.app_phone, href: `tel:${phoneDigits.value}`, dir: 'ltr' },
    settings.value.app_email && { icon: LucideMail, label: t('contact_form_info_email'), value: settings.value.app_email, href: `mailto:${settings.value.app_email}` },
    settings.value.working_hours && { icon: LucideClock, label: t('contact_form_info_working_hours'), value: settings.value.working_hours },
].filter(Boolean))

const quickLinks = computed(() => [
    { key: 'home', label: t('nav_home'), to: { name: 'home' } },
    { key: 'about', label: t('nav_about'), to: { name: 'about' } },
    { key: 'properties', label: t('nav_properties'), to: { name: 'properties' } },
    { key: 'services', label: t('nav_services'), to: { name: 'services' } },
    { key: 'areas', label: t('nav_areas'), to: { name: 'areas' } },
    { key: 'research', label: t('nav_research'), to: { name: 'research' } },
    { key: 'blog', label: t('nav_blog'), to: { name: 'blog' } },
    { key: 'contact', label: t('nav_contact'), to: { name: 'contact' } },
])

const form = reactive({
    name: '',
    email: '',
    phone: '',
    subject: '',
    type: 'general',
    message: '',
})

const errors = reactive({ name: '', email: '', phone: '', subject: '', message: '' })

// Per-field validator. Returns an error string, or '' when the field is valid.
const fieldError = (k) => {
    const v = form[k]?.trim()
    if (!v) return t('form_required', 'This field is required.')
    if (k === 'email' && !isValidEmail(v)) return t('form_invalid_email', 'Please enter a valid email address.')
    if (k === 'phone' && !isValidPhone(v)) return t('form_invalid_phone', 'Please enter a valid phone number.')
    return ''
}

// Once a field has shown an error, clear it as soon as the user fixes it.
watch(form, () => {
    for (const k in errors) if (errors[k] && !fieldError(k)) errors[k] = ''
}, { deep: true })

const submitting = ref(false)
const submitMsg = ref('')
const submitOk = ref(false)

async function onSubmit() {
    submitMsg.value = ''
    submitOk.value = false
    let ok = true
    for (const k in errors) {
        errors[k] = fieldError(k)
        if (errors[k]) ok = false
    }
    if (!ok) return
    submitting.value = true
    try {
        await $fetch('/api/contact-us', {
            method: 'POST',
            body: {
                name: form.name,
                email: form.email,
                phone: form.phone?.trim() || undefined,
                subject: form.subject,
                type: form.type,
                message: form.message,
            },
        })
        useNuxtApp().$track?.('generate_lead', { form: 'contact' })
        submitOk.value = true
        submitMsg.value = t('contact_form_success')
        Object.assign(form, { name: '', email: '', phone: '', subject: '', type: 'general', message: '' })
    } catch (e) {
        submitOk.value = false
        // Map Laravel-style field errors ({ field: [msg] }) back onto the inputs.
        const srv = e?.data?.errors
        let mapped = false
        if (srv && typeof srv === 'object') {
            for (const k in errors) {
                if (srv[k]?.length) { errors[k] = srv[k][0]; mapped = true }
            }
        }
        submitMsg.value = mapped ? '' : (e?.data?.message || t('contact_form_error'))
    } finally {
        submitting.value = false
    }
}
</script>
