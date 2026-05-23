export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    if (query.page !== undefined) params.page = query.page
    if (query.per_page !== undefined) params.per_page = query.per_page
    if (query.search !== undefined) params.search = query.search

    const res = await $fetch(`${config.baseUrl}/general/careers`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
