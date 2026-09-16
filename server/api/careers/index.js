export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    if (query.page !== undefined) params.page = query.page
    if (query.per_page !== undefined) params.per_page = query.per_page
    if (query.search !== undefined) params.search = query.search

    return await cmsFetch(event, 'general/careers', { query: params })
})
