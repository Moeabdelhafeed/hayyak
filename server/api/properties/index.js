export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const params = {}
    const keys = [
        'city_id', 'area_id', 'transaction', 'property_type',
        'min_price', 'max_price', 'bedrooms', 'bathrooms',
        'tag', 'keyword', 'sort', 'per_page', 'page'
    ]
    for (const k of keys) {
        if (query[k] !== undefined && query[k] !== '') params[k] = query[k]
    }

    return await cmsFetch(event, 'properties', { query: params })
})
