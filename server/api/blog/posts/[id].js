import { blogApiLive, mockCategories, mockFetchAllPosts, mockLang, mockPostCategory, mockPostExtras } from '~~/server/utils/blogMock'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        const res = await cmsFetch(event, `general/blog/posts/${id}`)
        if (blogApiLive() || !res?.data) return res
        // Same mocked category as the lists, so a post does not change category when you
        // open it. Costs one extra category + post list call while mocking.
        const lang = mockLang(event)
        const cats = mockCategories(
            await cmsFetch(event, 'general/blog/categories')
                .then((r) => (Array.isArray(r?.data) ? r.data : (r?.data?.data ?? [])))
                .catch(() => []),
            await mockFetchAllPosts(event).catch(() => []),
            lang,
        )
        return { ...res, data: mockPostExtras(mockPostCategory(res.data, cats, lang), lang) }
    } catch (err) {
        // A real 404 from the CMS means no such record. Anything else is an upstream
        // failure, and reporting it as "missing" would 404 a live page during an
        // outage — let it propagate so the page can answer 503 instead.
        if (err?.statusCode === 404 || err?.response?.status === 404) return { data: null }
        throw err
    }
})
