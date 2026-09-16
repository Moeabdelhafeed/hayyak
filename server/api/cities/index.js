export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    if (query.country_id !== undefined && query.country_id !== '') params.country_id = query.country_id

    return await cmsFetch(event, 'general/cities', { query: params })
})
