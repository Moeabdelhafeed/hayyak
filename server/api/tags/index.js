export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    if (query.type !== undefined && query.type !== '') params.type = query.type
    if (query.search !== undefined && query.search !== '') params.search = query.search

    const res = await $fetch(`${config.baseUrl}/general/tags`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
