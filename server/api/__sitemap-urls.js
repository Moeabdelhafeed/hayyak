// Dynamic sitemap source: emits locale-agnostic paths for every CMS detail page.
// `_i18nTransform: true` lets @nuxtjs/sitemap expand each into /en/... and /ar/...
// with reciprocal hreflang alternates automatically.
export default defineEventHandler(async () => {
    const config = useRuntimeConfig()
    const headers = { 'X-API-TOKEN': config.publicToken, 'Accept-Language': 'en' }

    // Fetch a CMS list, following Laravel pagination when present. `paginate:false`
    // for endpoints that return a plain array (areas, services) — avoids per_page 422s.
    const fetchList = async (path, { paginate = false, perPage = 50, maxPages = 40 } = {}) => {
        const out = []
        try {
            if (!paginate) {
                const res = await $fetch(`${config.baseUrl}/${path}`, { headers })
                return Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
            }
            let page = 1
            while (page <= maxPages) {
                const res = await $fetch(`${config.baseUrl}/${path}`, { headers, query: { per_page: perPage, page } })
                const body = res?.data ?? {}
                const items = Array.isArray(body) ? body : (body.data ?? [])
                out.push(...items)
                const last = Array.isArray(body) ? 1 : (body.last_page ?? 1)
                if (page >= last || items.length === 0) break
                page++
            }
        } catch {
            // best-effort — a failed list just contributes no URLs
        }
        return out
    }

    const [units, areas, posts, services, careers, pages] = await Promise.all([
        fetchList('units', { paginate: true }),
        fetchList('general/areas'),
        fetchList('general/blog/posts', { paginate: true }),
        fetchList('general/services'),
        fetchList('general/careers', { paginate: true }),
        fetchList('general/pages', { paginate: true }),
    ])

    const urls = []
    const push = (arr, prefix, key) => {
        for (const item of arr) {
            const val = item?.[key]
            if (val != null && val !== '') urls.push({ loc: `${prefix}/${val}`, _i18nTransform: true })
        }
    }

    push(units, '/properties', 'id')
    push(areas, '/areas', 'id')
    push(posts, '/insights', 'id')
    push(services, '/services', 'id')
    push(careers, '/careers', 'slug')
    push(pages, '/pages', 'slug')

    return urls
})
