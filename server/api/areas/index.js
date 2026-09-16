export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    if (query.city_id !== undefined && query.city_id !== '') params.city_id = query.city_id

    return await cmsFetch(event, 'general/areas', { query: params })
})
