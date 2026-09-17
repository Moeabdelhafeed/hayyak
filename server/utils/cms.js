// Single transport for every CMS read/write.
//
// The CMS intermittently 500s and rate-limits, and a bare $fetch turned that into
// an empty SSR page with a 200 status (Google crawled blank listings). So: retry
// transient failures, and cache GETs stale-while-revalidate — when the CMS is down
// we keep serving the last good payload for up to a day instead of nothing.
//
// ponytail: cache lives in Nitro's default in-memory/filesystem store, so it is
// per-node — each instance warms its own copy and a restart drops it cold. Fine for
// the single-node deploy. Upgrade path: point the `cache` storage mount at Redis in
// nuxt.config (nitro.storage.cache) — no change needed here.

const RETRY = {
    // One retry, not two. A page render fans out ~7 CMS calls; when the CMS is fully
    // down each extra attempt multiplies across all of them and turns a fast failure
    // into a hung render (measured: 172 attempts against one endpoint during an
    // outage). One retry still absorbs the transient 500s that are the actual
    // observed failure mode.
    retry: 1,
    retryDelay: 300,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
    // Never let an unresponsive CMS hold an SSR render open indefinitely.
    timeout: 2500,
}

const request = (lang, path, query, opts = {}) => {
    const config = useRuntimeConfig()
    return $fetch(`${config.baseUrl}/${String(path).replace(/^\/+/, '')}`, {
        query,
        ...RETRY,
        ...opts,
        headers: {
            'X-API-TOKEN': config.publicToken,
            ...opts.headers,
            'Accept-Language': lang,
        },
    })
}

// Sort the query keys so two callers passing the same params in a different order
// share one cache entry. base64 keeps the key filesystem-safe.
const queryKey = (query) =>
    Buffer.from(
        JSON.stringify(Object.entries(query || {}).sort(([a], [b]) => (a < b ? -1 : 1))),
    ).toString('base64url')

// Must not close over `event` — only plain serializable args go in.
const cachedRequest = defineCachedFunction((lang, path, query) => request(lang, path, query), {
    name: 'fetch',
    group: 'cms',
    swr: true,
    // How fast a CMS edit reaches the site: after maxAge the next request is served
    // stale and refreshes in the background, so an edit lands within ~2 requests.
    maxAge: 60,
    // Only reached when revalidation keeps FAILING, i.e. the CMS is down — this is the
    // blank-page insurance, not a freshness setting. An hour covers the observed
    // failure mode (intermittent 500s that clear in minutes) without the site ever
    // serving content a day old.
    staleMaxAge: 3600,
    getKey: (lang, path, query) => `${lang}:${path}:${queryKey(query)}`,
})

/**
 * cmsFetch(event, 'general/areas', { query, headers, ...ofetchOpts })
 * GETs are cached (swr); anything with a method, or `cache: false`, is not.
 * `headers['Accept-Language']` overrides the locale cookie (sitemap pins 'en').
 */
export function cmsFetch(event, path, { query, cache, ...opts } = {}) {
    const lang =
        opts.headers?.['Accept-Language'] || (getCookie(event, 'locale') === 'ar' ? 'ar' : 'en')
    const method = (opts.method || 'GET').toUpperCase()

    if (cache === false || method !== 'GET') return request(lang, path, query, opts)
    // Never cache in dev. The cache is stale-while-revalidate for an hour, so a CMS edit
    // (a tag colour, a title) appears on one reload and reverts on the next as
    // independently-aged entries take turns — which reads as a bug, not as a cache.
    if (import.meta.dev) return request(lang, path, query, opts)
    return cachedRequest(lang, path, query)
}
