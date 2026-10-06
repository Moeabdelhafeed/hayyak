export default defineEventHandler(async (event) => {
    // `category` is a category slug; the CMS returns an empty list for an unknown one.
    const { category, page, per_page } = getQuery(event)
    const query = {}
    if (category) query.category = String(category)
    if (page) query.page = page
    if (per_page) query.per_page = per_page

    return await cmsFetch(event, 'general/blog/posts', { query })
})
