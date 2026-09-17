export const useT = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/translations', {
        watch: [locale],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy.
        key: computed(() => `translations-${locale.value}`),
    })

    const dict = computed(() => res.value ?? {})

    const t = (key, fallback) => {
        const val = dict.value[key]
        if (val != null && val !== '') return val
        if (fallback != null) return fallback
        return key
    }

    return { t, locale, dict }
}
