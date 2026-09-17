// Blog/insight posts come from a Laravel paginator: res.data.data[]
const normalizePost = (p) => ({
    id: p.id,
    slug: p.slug || '',
    title: p.title || '',
    excerpt: p.excerpt || p.summary || p.short_description || p.meta_description || '',
    body: p.body || p.content || p.description || '',
    image: p.cover_image || p.image || p.thumbnail || p.banner || '',
    coverType: p.cover_type || 'image',
    pdf: p.pdf || '',
    category: p.category?.name || (typeof p.category === 'string' ? p.category : '') || p.tag || '',
    tags: (p.tags ?? []).map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean),
    date: p.published_at || p.created_at || p.date || '',
    updated: p.updated_at || p.modified_at || '',
})

// Deterministic formatter (fixed month names + UTC) so server and client render
// identical strings — toLocaleDateString/timezone differences caused hydration mismatches.
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
export const formatInsightDate = (value, lc = 'en-US') => {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    const ar = String(lc).startsWith('ar')
    const m = (ar ? MONTHS_AR : MONTHS_EN)[d.getUTCMonth()]
    return ar
        ? `${d.getUTCDate()} ${m} ${d.getUTCFullYear()}`
        : `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

// Locale-aware date formatter bound to the active locale cookie.
export const useInsightDate = () => {
    const locale = useCookie('locale', { default: () => 'en' })
    return (value) => formatInsightDate(value, locale.value === 'ar' ? 'ar-JO' : 'en-US')
}

// List composable.
export const useInsights = () => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res } = useFetch('/api/blog/posts', {
        watch: [locale],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy.
        key: computed(() => `insights-${locale.value}`),
    })

    return computed(() => {
        const list = res.value?.data?.data ?? res.value?.data ?? []
        if (!Array.isArray(list)) return []
        return list.map(normalizePost)
    })
}

// Detail composable.
export const useInsight = async (id) => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res, error } = await useFetch(() => `/api/blog/posts/${unref(id)}`, {
        watch: [locale, () => unref(id)],
        key: computed(() => `insight-${unref(id)}-${locale.value}`),
    })

    const post = computed(() => {
        const p = res.value?.data
        return p && p.id != null ? normalizePost(p) : null
    })
    return { post, error }
}
