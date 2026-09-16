export default defineEventHandler(async (event) => {
    try {
        return await cmsFetch(event, 'general/services')
    } catch {
        // backend not ready yet — frontend falls back to static services
        return { data: [] }
    }
})
