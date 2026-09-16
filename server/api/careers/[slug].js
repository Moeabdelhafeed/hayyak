export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    return await cmsFetch(event, `general/careers/${slug}`)
})
