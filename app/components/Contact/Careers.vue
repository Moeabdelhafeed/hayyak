<template>
    <section class="py-12 md:py-20 bg-white">
        <div class="px-4 max-w-[1350px] mx-auto">
            <div v-if="!selected">
                <div class="max-w-2xl">
                    <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold">{{ t('careers_list_title') }}</h2>
                    <p class="text-primary/80 text-sm md:text-base mt-3">{{ t('careers_list_body') }}</p>
                </div>

                <div v-if="jobs.length" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div
                        v-for="job in jobs"
                        :key="job.id || job.slug"
                        class="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <h3 class="font-display text-secondary text-lg font-bold">{{ job.title }}</h3>
                            <span v-if="job.type" class="text-xs uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                                {{ job.type }}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-primary/70 text-xs">
                            <span v-if="job.location" class="flex items-center gap-1.5">
                                <LucideMapPin class="size-3.5" />
                                {{ job.location }}
                            </span>
                            <span v-if="job.department" class="flex items-center gap-1.5">
                                <LucideBriefcase class="size-3.5" />
                                {{ job.department }}
                            </span>
                        </div>
                        <p v-if="job.short_description || job.summary" class="text-primary/80 text-sm leading-relaxed mt-4 line-clamp-3">
                            {{ job.short_description || job.summary }}
                        </p>
                        <button
                            type="button"
                            class="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors text-sm"
                            @click="open(job)"
                        >
                            {{ t('careers_apply_btn') }}
                            <LucideArrowRight class="size-4 rtl:rotate-180" />
                        </button>
                    </div>
                </div>

                <p v-else class="text-primary/70 text-sm mt-8">{{ t('careers_no_jobs') }}</p>
            </div>

            <div v-else class="max-w-2xl mx-auto">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 text-primary text-sm hover:underline"
                    @click="selected = null"
                >
                    <LucideArrowLeft class="size-4 rtl:rotate-180" />
                    {{ t('careers_apply_back') }}
                </button>

                <h2 class="font-display text-secondary text-2xl md:text-3xl font-bold mt-5">
                    {{ t('careers_apply_title') }} {{ selected.title }}
                </h2>

                <p v-if="submitMsg" :class="submitOk ? 'text-green-600' : 'text-red-600'" class="text-sm mt-3">
                    {{ submitMsg }}
                </p>

                <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" @submit.prevent="onSubmit">
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_first_name') }}</label>
                        <Input v-model="form.first_name" required :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_last_name') }}</label>
                        <Input v-model="form.last_name" required :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_email') }}</label>
                        <Input v-model="form.email" type="email" required :class="inputClass" />
                    </div>
                    <div>
                        <label :class="labelClass">{{ t('careers_apply_phone') }}</label>
                        <Input v-model="form.phone" dir="ltr" required placeholder="+962 7X XXX XXXX" :class="inputClass" />
                    </div>
                    <div class="sm:col-span-2">
                        <label :class="labelClass">{{ t('careers_apply_cv') }}</label>
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            required
                            class="block w-full text-sm text-secondary file:me-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                            @change="onFileChange"
                        >
                    </div>
                    <div class="sm:col-span-2">
                        <button
                            type="submit"
                            :disabled="submitting"
                            class="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-60"
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
import { ref, reactive, computed } from 'vue'

const { t } = useT()
const locale = useCookie('locale', { default: () => 'en' })

const { data: res } = await useFetch('/api/careers', {
    watch: [locale],
    key: `careers-list-${locale.value}`,
})

const jobs = computed(() => res.value?.data?.data ?? res.value?.data ?? [])

const selected = ref(null)
const open = (job) => {
    selected.value = job
    submitMsg.value = ''
    submitOk.value = false
}

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cv: null,
})

const onFileChange = (e) => {
    form.cv = e.target.files?.[0] || null
}

const inputClass = 'w-full bg-white !ring-0 rounded-lg py-5.5 border border-border !ring-offset-0 !shadow-none text-sm text-secondary placeholder:text-primary/80'
const labelClass = 'block text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2'

const submitting = ref(false)
const submitMsg = ref('')
const submitOk = ref(false)

async function onSubmit() {
    if (!selected.value?.slug) return
    submitting.value = true
    submitMsg.value = ''
    try {
        const fd = new FormData()
        fd.append('first_name', form.first_name)
        fd.append('last_name', form.last_name)
        fd.append('email', form.email)
        fd.append('phone', form.phone)
        if (form.cv) fd.append('cv', form.cv)

        await $fetch(`/api/careers/${selected.value.slug}/apply`, {
            method: 'POST',
            body: fd,
        })
        submitOk.value = true
        submitMsg.value = t('careers_apply_success')
        form.first_name = ''
        form.last_name = ''
        form.email = ''
        form.phone = ''
        form.cv = null
    } catch (e) {
        submitOk.value = false
        submitMsg.value = e?.data?.message || 'Submission failed. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>
