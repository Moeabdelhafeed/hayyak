export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    return await cmsFetch(event, `properties/${id}`)
})
