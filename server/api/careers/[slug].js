export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const slug = getRouterParam(event, 'slug')

    const res = await $fetch(`${config.baseUrl}/general/careers/${slug}`, {
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
