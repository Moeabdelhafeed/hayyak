export default defineEventHandler(async (event) => {
    return await cmsFetch(event, 'general/tags/amenities')
})
