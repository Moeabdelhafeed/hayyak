// Under i18n `strategy: 'prefix'`, unprefixed deep URLs (e.g. /properties) 404.
// 301-redirect them to the default-locale prefix (/en/...) so old/external links
// and retired URLs keep their equity. Root '/' is left to i18n's own redirect.
export default defineEventHandler((event) => {
    // Root '/' is left to i18n's own 301 redirect.
    const path = (event.path || '').split('?')[0]
    if (path === '/' || path === '') return

    const target = localePrefixed(path)
    if (!target) return

    return sendRedirect(event, target, 301)
})
