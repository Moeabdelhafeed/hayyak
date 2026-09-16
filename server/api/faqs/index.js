export default defineEventHandler(async (event) => {
    try {
        return await cmsFetch(event, 'general/faqs')
    } catch {
        // backend not ready yet — frontend falls back to translations
        return { data: [] }
    }
})
