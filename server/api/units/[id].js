export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')

    const res = await $fetch(`${config.baseUrl}/units/${id}`, {
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
