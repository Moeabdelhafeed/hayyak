export default defineNuxtPlugin(async () => {
    const route = useRoute()
    const locale = useCookie('locale', { default: () => '', path: '/' })

    const apply = (val) => {
        if (val && locale.value !== val) {
            locale.value = val
        }
    }

    if (route.query.locale) apply(String(route.query.locale))
    watch(() => route.query.locale, (v) => v && apply(String(v)))

    if (!locale.value) {
        try {
            const res = await $fetch('/api/languages')
            const list = res?.data ?? []
            const def = list.find(l => l.is_default) || list[0]
            if (def?.locale) locale.value = def.locale
        } catch {
            locale.value = 'en'
        }
    }
})
