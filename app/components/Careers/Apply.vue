<template>
    <section class="py-10 md:py-16 bg-[#f8fafb] min-h-[60vh]">
        <div class="px-4 max-w-[720px] mx-auto">
            <NuxtLinkLocale
                :to="slug ? { name: 'career-detail', params: { slug } } : { name: 'careers' }"
                class="inline-flex items-center gap-1.5 text-primary/60 hover:text-brand-turquoise text-sm transition-colors mb-6"
            >
                <LucideArrowLeft class="size-4 rtl:rotate-180" />
                {{ t('careers_apply_back') }}
            </NuxtLinkLocale>

            <div class="bg-white border border-border rounded-xl p-6 md:p-8">
                <h1 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ t('careers_apply_title') }}</h1>
                <p v-if="job?.title" class="text-brand-turquoise text-sm font-medium mt-1">{{ job.title }}</p>
                <p class="text-primary/75 text-sm mt-2">{{ t('careers_apply_subtitle') }}</p>

                <div v-if="submitOk" class="mt-6 rounded-lg bg-green-50 border border-green-200 p-5 text-center">
                    <p class="text-green-700 font-medium">{{ t('careers_apply_success') }}</p>
                    <NuxtLinkLocale :to="{ name: 'careers' }" class="inline-flex items-center gap-1.5 text-brand-turquoise text-sm mt-3 font-medium">
                        {{ t('careers_apply_back_to_list') }}
                        <LucideArrowRight class="size-4 rtl:rotate-180" />
                    </NuxtLinkLocale>
                </div>

                <form v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" @submit.prevent="onSubmit">
                    <p v-if="submitMsg" class="sm:col-span-2 text-sm text-red-600">{{ submitMsg }}</p>

                    <div>
                        <label :class="labelClass">{{ t('careers_apply_first_name') }} *</label>
                        <Input v-model="form.first_name" required maxlength="100" :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_last_name') }} *</label>
                        <Input v-model="form.last_name" required maxlength="100" :class="inputClass" />
                    </div>
                    <div class="sm:col-span-2">
                        <label :class="labelClass">{{ t('careers_apply_email') }} *</label>
                        <Input v-model="form.email" type="email" required maxlength="200" :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_country_code') }}</label>
                        <Input v-model="form.country_code" dir="ltr" maxlength="8" placeholder="+962" :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_phone') }}</label>
                        <Input v-model="form.phone" dir="ltr" maxlength="50" :class="inputClass" />
                    </div>
                    <div class="sm:col-span-2">
                        <label :class="labelClass">{{ t('careers_apply_cover_letter') }}</label>
                        <textarea v-model="form.cover_letter" rows="5" maxlength="5000" :class="[inputClass, 'resize-none py-3']" />
                    </div>
                    <div class="sm:col-span-2">
                        <label :class="labelClass">{{ t('careers_apply_cv') }}</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            class="block w-full text-sm text-primary/80 file:me-3 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-turquoise/10 file:text-brand-turquoise hover:file:bg-brand-turquoise/20 cursor-pointer"
                            @change="onFile"
                        >
                        <p class="text-primary/55 text-xs mt-1.5">{{ t('careers_apply_cv_hint') }}</p>
                    </div>

                    <div class="sm:col-span-2">
                        <button
                            type="submit"
                            :disabled="submitting"
                            class="inline-flex items-center gap-2 px-7 py-3 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 hover:shadow-[0_0_18px_rgba(255,91,0,0.45)] transition-all text-sm disabled:opacity-60 font-medium"
                        >
                            {{ submitting ? t('careers_apply_submitting') : t('careers_apply_submit') }}
                            <LucideArrowRight class="size-4 rtl:rotate-180" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { LucideArrowLeft, LucideArrowRight } from 'lucide-vue-next'

const { t } = useT()
const route = useRoute()
const slug = computed(() => route.query.slug || '')

const { data: jobRes } = await useFetch(() => `/api/careers/${slug.value}`, {
    immediate: !!slug.value,
})
const job = computed(() => jobRes.value?.data ?? null)

const inputClass = 'w-full bg-white !ring-0 rounded-lg py-5.5 border border-border !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const labelClass = 'block text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2'

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    country_code: '',
    phone: '',
    cover_letter: '',
})
const cvFile = ref(null)

const submitting = ref(false)
const submitMsg = ref('')
const submitOk = ref(false)

const onFile = (e) => {
    cvFile.value = e.target.files?.[0] ?? null
}

const flattenErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return ''
    return Object.values(errors).flat().filter(Boolean).join(' ')
}

const onSubmit = async () => {
    submitMsg.value = ''
    if (!slug.value) {
        submitMsg.value = t('careers_apply_no_job')
        return
    }
    submitting.value = true
    try {
        const fd = new FormData()
        fd.append('first_name', form.first_name)
        fd.append('last_name', form.last_name)
        fd.append('email', form.email)
        if (form.country_code) fd.append('country_code', form.country_code)
        if (form.phone) fd.append('phone', form.phone)
        if (form.cover_letter) fd.append('cover_letter', form.cover_letter)
        if (cvFile.value) fd.append('cv', cvFile.value)

        await $fetch(`/api/careers/${slug.value}/apply`, {
            method: 'POST',
            body: fd,
        })
        submitOk.value = true
    } catch (e) {
        submitMsg.value = flattenErrors(e?.data?.errors) || e?.data?.message || t('careers_apply_error')
    } finally {
        submitting.value = false
    }
}
</script>
