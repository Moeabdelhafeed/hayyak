export const useSettings = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/settings', {
        watch: [locale],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy.
        key: computed(() => `settings-${locale.value}`),
    })

    const settings = computed(() => res.value?.data ?? {})
    const social = computed(() => settings.value.social ?? {})

    // tel:/wa.me need digits only (wa.me rejects + and spaces)
    const phoneDigits = computed(() => String(settings.value.app_phone ?? '').replace(/\s+/g, ''))
    const whatsappDigits = computed(() => String(settings.value.app_whatsapp ?? '').replace(/[^\d]/g, ''))

    return { settings, social, phoneDigits, whatsappDigits }
}
