export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()

    try {
        return await $fetch(`${config.baseUrl}/general/services`, {
            headers: {
                'X-API-TOKEN': config.publicToken,
                'Accept-Language': lang,
            },
        })
    } catch {
        // backend not ready yet — frontend falls back to static services
        return { data: [] }
    }
})
