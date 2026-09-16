// Layout-wide (logo, phone, socials, schema.org identity) on every page — degrade to
// an empty object rather than 500ing the entire site when the CMS is unreachable.
export default defineEventHandler(async (event) => {
    try {
        return await cmsFetch(event, 'general/settings')
    } catch {
        return { data: {} }
    }
})
