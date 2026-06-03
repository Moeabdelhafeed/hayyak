export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')

    try {
        return await $fetch(`${config.baseUrl}/general/services/${id}`, {
            headers: {
                'X-API-TOKEN': config.publicToken,
                'Accept-Language': lang,
            },
        })
    } catch {
        // backend not ready yet — frontend falls back to static service
        return { data: null }
    }
})
