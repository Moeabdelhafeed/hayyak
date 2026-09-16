import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    const parts = await readMultipartFormData(event)
    const fd = new FormData()
    for (const p of parts || []) {
        if (!p.name) continue
        if (p.filename) {
            fd.append(p.name, new Blob([p.data], { type: p.type || 'application/octet-stream' }), p.filename)
        } else {
            fd.append(p.name, p.data.toString('utf-8'))
        }
    }

    return await cmsFetch(event, `general/careers/${slug}/apply`, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' },
    })
})
