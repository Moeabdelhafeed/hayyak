// The CMS paginates but does NOT sort, so sorting one page at a time left later
// pages unsorted. Here we pull the full filtered set from the CMS, sort it, then
// paginate — so sort is correct across every page.
export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const filterKeys = [
        'city_id', 'area_id', 'property_id', 'unit_type',
        'bedrooms', 'bathrooms', 'is_for_sale', 'is_for_rent',
        'min_price', 'max_price', 'tag', 'keyword', 'featured',
    ]
    const params = {}
    for (const k of filterKeys) {
        if (query[k] !== undefined && query[k] !== '') params[k] = query[k]
    }

    const headers = { 'X-API-TOKEN': config.publicToken, 'Accept-Language': lang }

    // Pull every matching unit (CMS caps per_page around 100; loop just in case).
    const all = []
    let page = 1
    let lastPage = 1
    do {
        const res = await $fetch(`${config.baseUrl}/units`, {
            query: { ...params, per_page: 100, page },
            headers,
        })
        const body = res?.data ?? {}
        const items = Array.isArray(body) ? body : (body.data ?? [])
        all.push(...items)
        lastPage = Array.isArray(body) ? 1 : (body.last_page ?? 1)
        page++
    } while (page <= lastPage && page <= 20)

    // Sort the full set.
    const priceOf = (u) => Number(u.sale_price ?? u.market_rent ?? 0)
    const sort = query.sort
    if (sort === 'price-asc') all.sort((a, b) => priceOf(a) - priceOf(b))
    else if (sort === 'price-desc') all.sort((a, b) => priceOf(b) - priceOf(a))
    else if (sort === 'newest') all.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

    // Paginate the sorted set.
    const perPage = Math.max(1, Number(query.per_page) || 12)
    const current = Math.max(1, Number(query.page) || 1)
    const total = all.length
    const start = (current - 1) * perPage
    const data = all.slice(start, start + perPage)

    return {
        data: {
            data,
            total,
            per_page: perPage,
            current_page: current,
            last_page: Math.max(1, Math.ceil(total / perPage)),
        },
    }
})
