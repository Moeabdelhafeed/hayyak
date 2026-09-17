// One rule for "does this path need the /en prefix", shared by the two redirect
// middlewares so a request that needs both fixes gets them in a single 301 instead of
// bouncing host -> prefix. Google counts every hop, and the SEO audit asks for one.
//
// Skips: internals, API, build assets, sitemaps/robots, anything with a file extension,
// and paths already carrying a locale (case-insensitive — `/EN` must not become
// `/en/EN`). The trailing `_` in the internals group matters: Nuxt renders errors by
// fetching `/__nuxt_error`, and redirecting that looped every 404 forever.
export const localePrefixed = (path) => {
    const clean = String(path || '').split('?')[0]
    if (/^\/(api|_nuxt|_ipx|_scripts|__sitemap__|__nuxt|_vercel)(_|\/|$)/.test(clean)) return null
    if (/^\/(en|ar)(\/|$)/i.test(clean)) return null
    if (clean === '/' || clean === '') return '/en'
    if (/\.[a-z0-9]+$/i.test(clean)) return null
    return `/en${clean}`
}
