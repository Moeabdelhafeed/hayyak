// Single transport for every CMS read/write.
//
// The CMS intermittently 500s and rate-limits, and a bare $fetch turned that into an
// empty SSR page with a 200 status (Google crawled blank listings), so transient
// failures are retried.
//
// Nothing here is cached. Every call hits the CMS. A CMS edit is therefore live on the
// next request, and a CMS outage is visible immediately rather than being papered over
// by a stale payload.

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

/**
 * cmsFetch(event, 'general/areas', { query, headers, ...ofetchOpts })
 * `headers['Accept-Language']` overrides the locale cookie (the sitemap pins 'en').
 * The `cache` option is accepted and ignored — nothing is cached either way.
 */
export function cmsFetch(event, path, { query, cache, ...opts } = {}) {
    const lang =
        opts.headers?.['Accept-Language'] || (getCookie(event, 'locale') === 'ar' ? 'ar' : 'en')
    return request(lang, path, query, opts)
}
