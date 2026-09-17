export const useHome = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const request = useFetch('/api/home', {
        watch: [locale],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy.
        key: computed(() => `home-${locale.value}`),
    })
    const { data: res, status } = request

    const home = computed(() => res.value?.data ?? {})
    // Guards media that has a local fallback: rendering the fallback before the
    // CMS answers makes the hero visibly swap sources mid-play.
    const ready = computed(() => status.value !== 'pending')

    return { home, ready, request }
}
