export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    if (query.type !== undefined && query.type !== '') params.type = query.type
    if (query.search !== undefined && query.search !== '') params.search = query.search

    return await cmsFetch(event, 'general/tags', { query: params })
})
