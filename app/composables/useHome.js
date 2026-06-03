export const useHome = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/home', {
        watch: [locale],
        key: 'home',
    })

    const home = computed(() => res.value?.data ?? {})

    return { home }
}
