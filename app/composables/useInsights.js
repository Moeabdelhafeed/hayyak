// Blog/insight posts come from a Laravel paginator: res.data.data[]
const normalizePost = (p) => ({
    id: p.id,
    title: p.title || '',
    excerpt: p.excerpt || p.summary || p.short_description || p.meta_description || '',
    body: p.body || p.content || p.description || '',
    image: p.cover_image || p.image || p.thumbnail || p.banner || '',
    category: p.category?.name || (typeof p.category === 'string' ? p.category : '') || p.tag || '',
    date: p.published_at || p.created_at || p.date || '',
})

export const formatInsightDate = (value) => {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// List composable.
export const useInsights = () => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res } = useFetch('/api/blog/posts', {
        watch: [locale],
        key: 'insights',
    })

    return computed(() => {
        const list = res.value?.data?.data ?? res.value?.data ?? []
        if (!Array.isArray(list)) return []
        return list.map(normalizePost)
    })
}

// Detail composable.
export const useInsight = (id) => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res } = useFetch(() => `/api/blog/posts/${unref(id)}`, {
        watch: [locale, () => unref(id)],
        key: computed(() => `insight-${unref(id)}`),
    })

    return computed(() => {
        const p = res.value?.data
        return p && p.id != null ? normalizePost(p) : null
    })
}
