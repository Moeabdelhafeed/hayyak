export default defineEventHandler(async (event) => {
    // `category` is a category slug, `section` is "research" | "blog". The CMS returns
    // an empty list for an unknown value of either, and the two combine with AND.
    const { category, section, page, per_page } = getQuery(event)
    const query = {}
    if (category) query.category = String(category)
    if (section) query.section = String(section)
    if (page) query.page = page
    if (per_page) query.per_page = per_page

    return await cmsFetch(event, 'general/blog/posts', { query })
})
