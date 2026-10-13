// TEMPORARY — stand-in for CMS fields the backend has not shipped yet:
//
//   categories[].section   "research" | "blog"
//   posts[].pdfs[]         [{ title, url }]  (today: one `pdf` string)
//   posts[].links[]        [{ label, url }]
//
// It also invents two extra categories and reassigns the five real posts across them,
// so the category-card row can be reviewed with more than one card per section. There
// are only five posts in the CMS, so a post had to be borrowed from research to give
// blog a second category — the split here is for looking at, not a content decision.
//
// The frontend is written against the real shape; this file fakes it. See
// BACKEND_RESEARCH_BLOG.md.
//
// To switch to the live API: set NUXT_BLOG_API_LIVE=true (no code change), then delete
// this file and the `mock*` calls in server/api/blog/. Each helper returns the CMS value
// untouched once the real field is present, so a partial rollout also works.

export const blogApiLive = () => String(process.env.NUXT_BLOG_API_LIVE) === 'true'

// Which bucket each real category slug belongs to. The backend will own this once
// `section` exists on a category.
const SECTION_BY_SLUG = {
    'price-index': 'research',
    'market-report': 'research',
    'investment-guide': 'blog',
    test: 'blog',
}

// Categories that do not exist in the CMS at all. Negative ids so they can never
// collide with a real one. One deliberately pale colour (#fcd34d) to exercise the
// dark-text path in app/utils/contrast.js.
const MOCK_CATEGORIES = [
    {
        id: -101,
        slug: 'rental-yields',
        section: 'research',
        color: '#fcd34d',
        name: { en: 'Rental Yields', ar: 'عوائد الإيجار' },
        description: {
            en: 'Gross and net yield benchmarks by neighbourhood and unit type.',
            ar: 'معايير العائد الإجمالي والصافي حسب الحي ونوع الوحدة.',
        },
    },
    {
        id: -102,
        slug: 'buying-guides',
        section: 'blog',
        color: '#8b5cf6',
        name: { en: 'Buying Guides', ar: 'أدلة الشراء' },
        description: {
            en: 'Step-by-step guides for first-time buyers and overseas investors.',
            ar: 'أدلة خطوة بخطوة للمشترين الجدد والمستثمرين من الخارج.',
        },
    },
]

// Post slug -> category slug. Anything not listed keeps its real CMS category.
const CATEGORY_BY_POST = {
    'arpi-pulse-q12026': 'price-index',
    'arpi-pulse-q22026': 'market-report',
    'arpi-pulse-q32025': 'rental-yields',
    'arpi-pulse-q42025': 'buying-guides',
}

const localized = (field, lang) =>
    (field && typeof field === 'object' ? (field[lang] ?? field.en) : field) || ''

export const mockCategorySection = (c) => {
    if (!c || typeof c !== 'object') return c
    if (c.section) return c
    return { ...c, section: SECTION_BY_SLUG[c.slug] || 'blog' }
}

// The category a post belongs to under the mock reassignment.
export const mockPostCategorySlug = (p) =>
    CATEGORY_BY_POST[p?.slug] || p?.category_slug || p?.category?.slug || ''

/**
 * Real categories (+ `section`) plus the invented ones, with `posts_count` recomputed
 * from the reassignment — otherwise a card would advertise a count its category page
 * cannot show.
 */
export const mockCategories = (list, posts, lang = 'en') => {
    const tally = {}
    for (const p of posts || []) {
        const slug = mockPostCategorySlug(p)
        if (slug) tally[slug] = (tally[slug] || 0) + 1
    }
    const invented = MOCK_CATEGORIES.map((c) => ({
        id: c.id,
        slug: c.slug,
        section: c.section,
        color: c.color,
        name: localized(c.name, lang),
        description: localized(c.description, lang),
        cover_image: null,
        posts_count: 0,
    }))
    return [...(list || []).map(mockCategorySection), ...invented].map((c) => ({
        ...c,
        posts_count: tally[c.slug] ?? 0,
    }))
}

/** Rewrite a post's category to the mocked one, label included. */
export const mockPostCategory = (p, categories = [], lang = 'en') => {
    if (!p || typeof p !== 'object') return p
    const slug = mockPostCategorySlug(p)
    if (!slug || slug === p.category_slug) return p
    const cat = categories.find((c) => c.slug === slug)
    return {
        ...p,
        category: cat ? localized(cat.name, lang) : p.category,
        category_slug: slug,
        category_id: cat?.id ?? p.category_id,
    }
}

// Extra documents and links per post, so a multi-document post can be reviewed. Every
// entry reuses the post's own real `pdf` URL, so each button downloads something real —
// only the titles and sizes are invented. Sizes are bytes, which is what we are asking
// the backend for.
const EXTRA_DOCS = {
    'arpi-pulse-q12026': [
        { title: { en: 'Full report', ar: 'التقرير الكامل' }, size: 2_412_544 },
        { title: { en: 'Data appendix (tables)', ar: 'ملحق البيانات (جداول)' }, size: 684_032 },
        { title: { en: 'Methodology note', ar: 'منهجية الحساب' }, size: 142_336 },
    ],
    'arpi-pulse-q22026': [
        { title: { en: 'Full report', ar: 'التقرير الكامل' }, size: 2_210_304 },
        { title: { en: 'Data appendix (tables)', ar: 'ملحق البيانات (جداول)' }, size: 702_464 },
    ],
    'arpi-pulse-q32025': [
        { title: { en: 'Yield benchmarks 2025', ar: 'معايير العوائد 2025' }, size: 1_884_160 },
    ],
}

const EXTRA_LINKS = {
    'arpi-pulse-q12026': [
        { label: { en: 'Department of Lands and Survey', ar: 'دائرة الأراضي والمساحة' }, url: 'https://dls.gov.jo' },
        { label: { en: 'Central Bank of Jordan — statistics', ar: 'البنك المركزي الأردني — الإحصاءات' }, url: 'https://www.cbj.gov.jo/Pages/viewpage?pageID=132' },
        { label: { en: 'Previous quarter: ARPI Pulse Q4 2025', ar: 'الربع السابق: ARPI Pulse الربع الرابع 2025' }, url: 'https://hayyakpm.com/en/insights/arpi-pulse-q42025' },
    ],
    'arpi-pulse-q22026': [
        { label: { en: 'Department of Statistics — housing', ar: 'دائرة الإحصاءات العامة — الإسكان' }, url: 'https://dosweb.dos.gov.jo' },
    ],
    'arpi-pulse-q32025': [
        { label: { en: 'Department of Lands and Survey', ar: 'دائرة الأراضي والمساحة' }, url: 'https://dls.gov.jo' },
    ],
}

export const mockPostExtras = (p, lang = 'en') => {
    if (!p || typeof p !== 'object') return p
    const out = { ...p }

    // One `pdf` becomes a `pdfs[]` so the UI only has one shape to render. Where the
    // table above has entries, fan the single file out into several named documents.
    if (!Array.isArray(out.pdfs)) {
        const extras = out.pdf ? EXTRA_DOCS[out.slug] : null
        out.pdfs = extras
            ? extras.map((d) => ({ title: localized(d.title, lang), url: out.pdf, size: d.size }))
            : out.pdf
              ? [{ title: out.title || 'PDF', url: out.pdf }]
              : []
    }

    if (!Array.isArray(out.links)) {
        out.links = (EXTRA_LINKS[out.slug] || []).map((l) => ({
            label: localized(l.label, lang),
            url: l.url,
        }))
    }
    return out
}

// --- mock-only data access -------------------------------------------------------
// The CMS cannot filter by the invented categories or by section, so while mocking we
// pull the whole list and do it here. Five posts, so the extra round trips are cheap.

// 50, not 100: general/blog/posts rejects a larger page size with a 422.
const MAX_PER_PAGE = 50

export const mockFetchAllPosts = async (event, query = {}) => {
    const out = []
    let page = 1
    let lastPage = 1
    do {
        const res = await cmsFetch(event, 'general/blog/posts', {
            query: { ...query, per_page: MAX_PER_PAGE, page },
        })
        const body = res?.data ?? {}
        const items = Array.isArray(body) ? body : (body.data ?? [])
        out.push(...items)
        lastPage = Array.isArray(body) ? 1 : (body.last_page ?? 1)
        page++
    } while (page <= lastPage && page <= 20)
    return out
}

export const mockLang = (event) => (getCookie(event, 'locale') === 'ar' ? 'ar' : 'en')
