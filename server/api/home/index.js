export default defineEventHandler(async (event) => {
    try {
        return await cmsFetch(event, 'general/home')
    } catch {
        // backend not ready yet — frontend falls back to static content
        return { data: null }
    }
})
