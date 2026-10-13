export default defineEventHandler(async (event) => {
    // `section` is "research" | "blog"; the CMS filters on it.
    const { section } = getQuery(event)
    try {
        return await cmsFetch(event, 'general/blog/categories', {
            query: section ? { section: String(section) } : undefined,
        })
    } catch {
        // A category list that fails must not take the listing page down with it.
        return { data: [] }
    }
})
