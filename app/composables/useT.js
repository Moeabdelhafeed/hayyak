export const useT = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/translations', {
        watch: [locale],
        key: 'translations',
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
