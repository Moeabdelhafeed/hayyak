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
    // `category` is the localized label; these are the stable keys to link/filter on.
    categorySlug: p.category_slug || p.category?.slug || '',
    categoryId: p.category_id ?? p.category?.id ?? null,
    tags: (p.tags ?? []).map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean),
    // Not set by the CMS today; the moment it is, the detail page prefers it.
    metaTitle: p.meta_title || '',
    metaDescription: p.meta_description || '',
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
export const useInsights = (category) => {
    const locale = useCookie('locale', { default: () => 'en' })
    const slug = computed(() => unref(category) || '')

    const { data: res } = useFetch('/api/blog/posts', {
        query: computed(() => (slug.value ? { category: slug.value } : {})),
        watch: [locale, slug],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy. The
        // category belongs there for the same reason.
        key: computed(() => `insights-${locale.value}-${slug.value || 'all'}`),
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

// Category list for the insights landing page.
export const useBlogCategories = () => {
    const locale = useCookie('locale', { default: () => 'en' })

    const request = useFetch('/api/blog/categories', {
        watch: [locale],
        key: computed(() => `blog-categories-${locale.value}`),
    })
    const { data: res } = request

    const categories = computed(() =>
        (res.value?.data ?? []).map((c) => ({
            id: c.id,
            slug: c.slug || '',
            name: c.name || '',
            description: c.description || '',
            color: c.color || '',
            count: Number(c.posts_count) || 0,
        })),
    )

    // `request` is awaited by the category page: it 404s on an unknown slug, and that
    // decision cannot be made before the list has actually arrived.
    return { categories, request }
}
