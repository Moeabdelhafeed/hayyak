export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const body = await readBody(event)

    try {
        return await $fetch(`${config.baseUrl}/leads`, {
            method: 'POST',
            body,
            headers: {
                'X-API-TOKEN': config.publicToken,
                'Accept-Language': lang,
                'Accept': 'application/json',
            }
        })
    } catch (e) {
        // surface the real CRM message instead of the generic "422 Unprocessable Entity"
        const crm = e?.data ?? {}
        const message = crm.error || crm.message || e?.message || 'Lead submission failed.'
        throw createError({
            statusCode: e?.response?.status || e?.statusCode || 422,
            statusMessage: message,
            data: { message, errors: crm.errors || null },
        })
    }
})
