export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    const keys = [
        'city_id', 'area_id', 'property_id', 'unit_type',
        'bedrooms', 'bathrooms', 'is_for_sale', 'is_for_rent',
        'min_price', 'max_price', 'tag', 'keyword', 'sort',
        'per_page', 'page', 'featured'
    ]
    for (const k of keys) {
        if (query[k] !== undefined && query[k] !== '') params[k] = query[k]
    }

    const res = await $fetch(`${config.baseUrl}/units`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
