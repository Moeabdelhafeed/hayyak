export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const body = await readBody(event)

    const res = await $fetch(`${config.baseUrl}/leads`, {
        method: 'POST',
        body,
        headers: {
            'X-API-TOKEN': config.publicToken,
            'Accept-Language': lang,
            'Accept': 'application/json',
        }
    })

    return res
})
