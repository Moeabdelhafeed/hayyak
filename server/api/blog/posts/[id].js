export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    try {
        return await cmsFetch(event, `general/blog/posts/${id}`)
    } catch (err) {
        // A real 404 from the CMS means no such record. Anything else is an upstream
        // failure, and reporting it as "missing" would 404 a live page during an
        // outage — let it propagate so the page can answer 503 instead.
        if (err?.statusCode === 404 || err?.response?.status === 404) return { data: null }
        throw err
    }
})
