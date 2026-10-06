export default defineEventHandler(async (event) => {
    try {
        return await cmsFetch(event, 'general/blog/categories')
    } catch {
        // A category list that fails must not take the insights page down with it.
        return { data: [] }
    }
})
