export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await cmsFetch(event, 'general/contact-us', {
        method: 'POST',
        body,
        headers: { 'Accept': 'application/json' },
    })
})
