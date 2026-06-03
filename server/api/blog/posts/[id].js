export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')

    try {
        return await $fetch(`${config.baseUrl}/general/blog/posts/${id}`, {
            headers: {
                'X-API-TOKEN': config.publicToken,
                'Accept-Language': lang,
            },
        })
    } catch {
        // single-post endpoint may not exist yet — fall back gracefully
        return { data: null }
    }
})
