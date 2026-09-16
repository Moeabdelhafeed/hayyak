export const useHome = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const request = useFetch('/api/home', {
        watch: [locale],
        key: 'home',
    })
    const { data: res, status } = request

    const home = computed(() => res.value?.data ?? {})
    // Guards media that has a local fallback: rendering the fallback before the
    // CMS answers makes the hero visibly swap sources mid-play.
    const ready = computed(() => status.value !== 'pending')

    return { home, ready, request }
}
