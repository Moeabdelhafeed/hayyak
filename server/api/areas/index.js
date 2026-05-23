export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    if (query.city_id !== undefined && query.city_id !== '') params.city_id = query.city_id

    const res = await $fetch(`${config.baseUrl}/general/areas`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
