export default defineEventHandler(async (event) => {
    return await cmsFetch(event, 'units/types')
})
