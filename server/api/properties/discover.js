export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    if (query.type !== undefined) params.type = query.type
    if (query.limit !== undefined) params.limit = query.limit

    return await cmsFetch(event, 'properties/discover', { query: params })
})
