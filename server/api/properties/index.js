export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
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

    const res = await $fetch(`${config.baseUrl}/properties`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
