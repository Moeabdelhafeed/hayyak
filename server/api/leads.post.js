export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        return await cmsFetch(event, 'leads', {
            method: 'POST',
            body,
            headers: { 'Accept': 'application/json' },
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
