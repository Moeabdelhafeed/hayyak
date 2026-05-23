export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()

    const res = await $fetch(`${config.baseUrl}/general/settings`, {
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
        }
    })

    return res
})
