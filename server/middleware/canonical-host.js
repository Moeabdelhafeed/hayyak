// Safety-net enforcement of the single canonical origin (https + non-www) at the
// app layer, in case the host edge (Hostinger/LiteSpeed .htaccess) doesn't. Only
// acts on the production domain family so preview/other hosts are untouched.
export default defineEventHandler((event) => {
    if (import.meta.dev) return

    const req = event.node.req
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    if (!host) return

    const proto = String(req.headers['x-forwarded-proto'] || 'https')
    const cleanHost = host.replace(/^www\./, '')

    // Only enforce for our own domain — never hijack unrelated hosts.
    if (!/(^|\.)hayyakpm\.com$/.test(cleanHost)) return

    const isWww = host.startsWith('www.')
    const isHttp = proto === 'http'
    if (!isWww && !isHttp) return

    // Carry the locale prefix in the same redirect. Without this, http://host/ took
    // two hops (-> https://host/ -> /en) and www deep links took two as well.
    const target = localePrefixed(event.path) ?? event.path
    return sendRedirect(event, `https://${cleanHost}${target}`, 301)
})
