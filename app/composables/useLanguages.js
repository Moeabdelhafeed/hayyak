export const useLanguages = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })
    const switchLocalePath = useSwitchLocalePath()

    const { data: langsRes } = useFetch('/api/languages', {
        key: 'languages',
    })

    const languages = computed(() => langsRes.value?.data ?? [])
    const defaultLang = computed(() => languages.value.find(l => l.is_default) || languages.value[0] || null)
    const currentLang = computed(() => languages.value.find(l => l.locale === locale.value) || defaultLang.value)

    // Switch = keep the content cookie in sync AND navigate to the prefixed URL (/en, /ar).
    const setLocale = (code) => {
        if (!code) return
        if (!languages.value.length || languages.value.some(l => l.locale === code)) {
            locale.value = code
            const target = switchLocalePath(code)
            if (target) return navigateTo(target)
        }
    }

    const toggle = () => {
        if (languages.value.length < 2) return
        const idx = languages.value.findIndex(l => l.locale === locale.value)
        const next = languages.value[(idx + 1) % languages.value.length]
        if (next) setLocale(next.locale)
    }

    return { locale, languages, defaultLang, currentLang, setLocale, toggle }
}
