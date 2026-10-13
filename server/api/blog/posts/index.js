import {
    blogApiLive,
    mockCategories,
    mockFetchAllPosts,
    mockLang,
    mockPostCategory,
    mockPostCategorySlug,
    mockPostExtras,
} from '~~/server/utils/blogMock'

export default defineEventHandler(async (event) => {
    // `category` is a category slug; the CMS returns an empty list for an unknown one.
    // `section` ("research" | "blog") groups categories and is not a CMS filter yet.
    const { category, section, page, per_page } = getQuery(event)

    const perPage = Math.max(1, Number(per_page) || 9)
    const current = Math.max(1, Number(page) || 1)

    if (blogApiLive()) {
        const query = { page: current, per_page: perPage }
        if (category) query.category = String(category)
        if (section) query.section = String(section)
        return await cmsFetch(event, 'general/blog/posts', { query })
    }

    // Mocked: the CMS knows neither `section` nor the invented categories, so pull the
    // whole list, apply the mock reassignment, then filter and paginate here.
    const lang = mockLang(event)
    const cmsCats = await cmsFetch(event, 'general/blog/categories')
        .then((r) => (Array.isArray(r?.data) ? r.data : (r?.data?.data ?? [])))
        .catch(() => [])
    const all = await mockFetchAllPosts(event)
    const cats = mockCategories(cmsCats, all, lang)

    let list = all
    if (category) list = list.filter((p) => mockPostCategorySlug(p) === String(category))
    if (section) {
        const inSection = new Set(cats.filter((c) => c.section === String(section)).map((c) => c.slug))
        list = list.filter((p) => inSection.has(mockPostCategorySlug(p)))
    }

    const start = (current - 1) * perPage
    return {
        data: {
            data: list
                .slice(start, start + perPage)
                .map((p) => mockPostExtras(mockPostCategory(p, cats, lang), lang)),
            total: list.length,
            per_page: perPage,
            current_page: current,
            last_page: Math.max(1, Math.ceil(list.length / perPage)),
        },
    }
})
