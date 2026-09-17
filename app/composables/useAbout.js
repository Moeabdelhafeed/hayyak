export const useAbout = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/about', {
        watch: [locale],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy.
        key: computed(() => `about-${locale.value}`),
    })

    const about = computed(() => res.value?.data ?? {})

    return { about }
}

// rich-text body → array of paragraphs (split on blank lines / newlines)
export const toParagraphs = (text) =>
    String(text || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
