// Under i18n `strategy: 'prefix'`, unprefixed deep URLs (e.g. /properties) 404.
// 301-redirect them to the default-locale prefix (/en/...) so old/external links
// and retired URLs keep their equity. Root '/' is left to i18n's own redirect.
export default defineEventHandler((event) => {
    const path = (event.path || '').split('?')[0]

    // Skip internals, API, build assets, sitemaps/robots and any file with an extension.
    if (/^\/(api|_nuxt|_ipx|_scripts|__sitemap__|__nuxt|_vercel)(\/|$)/.test(path)) return
    if (/^\/(en|ar)(\/|$)/.test(path)) return
    if (path === '/' || path === '') return
    if (/\.[a-z0-9]+$/i.test(path)) return

    return sendRedirect(event, `/en${path}`, 301)
})
