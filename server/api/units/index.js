// The CMS paginates but does NOT sort, so sorting one page at a time left later
// pages unsorted. Here we pull the full filtered set from the CMS, sort it, then
// paginate — so sort is correct across every page.
//
// Each page of the full pull is cached by cmsFetch (per lang + filters + page),
// so paging and sorting don't re-hit the CMS on every click.
export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    // min_price/max_price are handled here, not by the CMS: the CMS price filter
    // only matches units that carry a listing-price row, so `min_price=1` cut the
    // catalogue from 172 units to 26. Filter on the price we actually display.
    const filterKeys = [
        'city_id', 'area_id', 'property_id', 'unit_type',
        'bedrooms', 'bathrooms', 'is_for_sale', 'is_for_rent',
        'tag', 'keyword', 'featured',
    ]
    const params = {}
    for (const k of filterKeys) {
        if (query[k] !== undefined && query[k] !== '') params[k] = query[k]
    }

    const all = []
    let page = 1
    let lastPage = 1
    do {
        const res = await cmsFetch(event, 'units', { query: { ...params, per_page: 100, page } })
        const body = res?.data ?? {}
        const items = Array.isArray(body) ? body : (body.data ?? [])
        all.push(...items)
        lastPage = Array.isArray(body) ? 1 : (body.last_page ?? 1)
        page++
    } while (page <= lastPage && page <= 20)

    const priceOf = (u) => Number(u.sale_price ?? u.market_rent ?? 0)
    const bound = (k) => {
        const v = query[k]
        if (v === undefined || v === '') return null
        const n = Number(v)
        return Number.isFinite(n) ? n : null
    }
    const min = bound('min_price')
    const max = bound('max_price')
    let list = all
    if (min !== null) list = list.filter((u) => priceOf(u) >= min)
    if (max !== null) list = list.filter((u) => priceOf(u) <= max)

    // Sort the full set. (Copy first — items may come from a cached payload.)
    const sort = query.sort
    list = [...list]
    if (sort === 'price-asc') list.sort((a, b) => priceOf(a) - priceOf(b))
    else if (sort === 'price-desc') list.sort((a, b) => priceOf(b) - priceOf(a))
    else if (sort === 'newest') list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

    // Paginate the sorted set.
    const perPage = Math.max(1, Number(query.per_page) || 12)
    const current = Math.max(1, Number(query.page) || 1)
    const total = list.length
    const start = (current - 1) * perPage
    const data = list.slice(start, start + perPage)

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
