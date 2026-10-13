// Blog/insight posts come from a Laravel paginator: res.data.data[]

// CMS-entered URLs go straight into an href, so anything that is not http(s) is dropped
// here — `javascript:` and `data:` in an editor field are an XSS vector, and a relative
// path would resolve against our own origin, which is never what an attachment means.
const safeUrl = (u) => {
    try {
        return /^https?:$/.test(new URL(String(u)).protocol) ? String(u) : ''
    } catch {
        return ''
    }
}
const normalizePost = (p) => ({
    id: p.id,
    slug: p.slug || '',
    title: p.title || '',
    excerpt: p.excerpt || p.summary || p.short_description || p.meta_description || '',
    body: p.body || p.content || p.description || '',
    image: p.cover_image || p.image || p.thumbnail || p.banner || '',
    coverType: p.cover_type || 'image',
    // `pdfs` is the shape going forward; `pdf` stays as the single-file fallback so a
    // CMS that has not shipped the array yet still renders a download.
    pdfs: Array.isArray(p.pdfs)
        ? p.pdfs
            .map(f => ({
                title: f?.title || f?.name || 'PDF',
                url: safeUrl(f?.url || f?.file),
                // Bytes, optional — rendered as "2.4 MB" when the CMS sends it.
                size: Number(f?.size) || 0,
            }))
            .filter(f => f.url)
        : (safeUrl(p.pdf) ? [{ title: p.title || 'PDF', url: safeUrl(p.pdf), size: 0 }] : []),
    links: Array.isArray(p.links)
        ? p.links
            .map(l => ({ label: l?.label || l?.title || l?.url || '', url: safeUrl(l?.url) }))
            .filter(l => l.url)
        : [],
    pdf: safeUrl(p.pdf) || (Array.isArray(p.pdfs) ? safeUrl(p.pdfs[0]?.url) : ''),
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

// List composable. Returns the paginator meta alongside the posts so callers can
// render a pager — without `per_page`/`page` the CMS only ever returns its first page.
export const useInsights = (category, page, perPage = 9, section = null) => {
    const locale = useCookie('locale', { default: () => 'en' })
    const slug = computed(() => unref(category) || '')
    const pageNum = computed(() => Math.max(1, Number(unref(page)) || 1))
    const sec = computed(() => unref(section) || '')

    const { data: res } = useFetch('/api/blog/posts', {
        query: computed(() => ({
            ...(slug.value ? { category: slug.value } : {}),
            ...(sec.value ? { section: sec.value } : {}),
            page: pageNum.value,
            per_page: perPage,
        })),
        watch: [locale, slug, pageNum, sec],
        // The locale belongs in the key, not just in `watch`. A constant key makes the
        // payload entry shared by both languages, so after the first client-side switch
        // nothing refetches and the page renders the previous language's copy. The
        // category and page belong there for the same reason.
        key: computed(() => `insights-${locale.value}-${sec.value || 'any'}-${slug.value || 'all'}-${pageNum.value}`),
    })

    const posts = computed(() => {
        const list = res.value?.data?.data ?? res.value?.data ?? []
        if (!Array.isArray(list)) return []
        return list.map(normalizePost)
    })

    return {
        posts,
        // A plain array response has no meta — treat it as a single page.
        lastPage: computed(() => Number(res.value?.data?.last_page) || 1),
        total: computed(() => Number(res.value?.data?.total) || posts.value.length),
    }
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
export const useBlogCategories = (section = null) => {
    const locale = useCookie('locale', { default: () => 'en' })
    const sec = computed(() => unref(section) || '')

    const request = useFetch('/api/blog/categories', {
        query: computed(() => (sec.value ? { section: sec.value } : {})),
        watch: [locale, sec],
        key: computed(() => `blog-categories-${locale.value}-${sec.value || 'all'}`),
    })
    const { data: res } = request

    const categories = computed(() =>
        (res.value?.data ?? []).map((c) => ({
            id: c.id,
            slug: c.slug || '',
            name: c.name || '',
            description: c.description || '',
            color: c.color || '',
            // "research" | "blog" — which top-level section the category belongs to.
            section: c.section || '',
            count: Number(c.posts_count) || 0,
        })),
    )

    // `request` is awaited by the category page: it 404s on an unknown slug, and that
    // decision cannot be made before the list has actually arrived.
    return { categories, request }
}
