export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const params = {}
    if (query.type !== undefined) params.type = query.type
    if (query.limit !== undefined) params.limit = query.limit

    const res = await $fetch(`${config.baseUrl}/properties/discover`, {
        query: params,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
