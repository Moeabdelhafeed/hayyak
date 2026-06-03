export const useAbout = () => {
    const locale = useCookie('locale', { default: () => 'en', path: '/' })

    const { data: res } = useFetch('/api/about', {
        watch: [locale],
        key: 'about',
    })

    const about = computed(() => res.value?.data ?? {})

    return { about }
}

// rich-text body → array of paragraphs (split on blank lines / newlines)
export const toParagraphs = (text) =>
    String(text || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
