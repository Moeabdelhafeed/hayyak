export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    if (query.country_id !== undefined && query.country_id !== '') params.country_id = query.country_id

    const res = await $fetch(`${config.baseUrl}/general/cities`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
