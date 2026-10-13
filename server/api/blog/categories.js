import { blogApiLive, mockCategories, mockFetchAllPosts, mockLang } from '~~/server/utils/blogMock'

export default defineEventHandler(async (event) => {
    const { section } = getQuery(event)
    try {
        const res = await cmsFetch(event, 'general/blog/categories', {
            query: section ? { section: String(section) } : undefined,
        })
        const cms = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])

        // `section` and the extra categories are mocked until the CMS sends them.
        const list = blogApiLive()
            ? cms
            : mockCategories(cms, await mockFetchAllPosts(event).catch(() => []), mockLang(event))

        // The CMS ignores unknown params today, so the filter has to be applied here too
        // — otherwise a section page lists every category.
        return { ...res, data: section ? list.filter((c) => c.section === String(section)) : list }
    } catch {
        // A category list that fails must not take the insights page down with it.
        return { data: [] }
    }
})
