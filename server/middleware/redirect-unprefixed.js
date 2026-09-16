// Under i18n `strategy: 'prefix'`, unprefixed deep URLs (e.g. /properties) 404.
// 301-redirect them to the default-locale prefix (/en/...) so old/external links
// and retired URLs keep their equity. Root '/' is left to i18n's own redirect.
export default defineEventHandler((event) => {
    const path = (event.path || '').split('?')[0]

    // Skip internals, API, build assets, sitemaps/robots and any file with an extension.
    // The trailing `_` in the group tail matters: Nuxt renders errors by fetching
    // `/__nuxt_error`, which is `__nuxt` followed by `_`. Without it that request got
    // redirected to `/en/__nuxt_error` — not a route — which errored, re-fetched
    // `/__nuxt_error`, and looped forever, so every 404 was an infinite 301 chain
    // instead of the localized error page.
    if (/^\/(api|_nuxt|_ipx|_scripts|__sitemap__|__nuxt|_vercel)(_|\/|$)/.test(path)) return
    // Case-insensitive: `/EN` used to fall through and become `/en/EN` -> 404.
    if (/^\/(en|ar)(\/|$)/i.test(path)) return
    if (path === '/' || path === '') return
    if (/\.[a-z0-9]+$/i.test(path)) return

    return sendRedirect(event, `/en${path}`, 301)
})
