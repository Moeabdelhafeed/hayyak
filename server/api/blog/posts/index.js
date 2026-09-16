export default defineEventHandler(async (event) => {
    return await cmsFetch(event, 'general/blog/posts')
})
