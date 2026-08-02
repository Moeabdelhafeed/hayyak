// Bridge the URL locale prefix (/en, /ar) to the CMS content pipeline, which
// resolves language from the `locale` cookie server-side. We set the cookie AND,
// on SSR, patch the incoming request cookie header so the forwarded internal
// /api/* fetches (and getCookie in server routes) see the URL's locale on the
// very first render — not the stale browser cookie.
export default defineNuxtRouteMiddleware((to) => {
    const loc = /^\/ar(\/|$)/.test(to.path) ? 'ar' : 'en'

    const cookie = useCookie('locale', { path: '/' })
    if (cookie.value !== loc) cookie.value = loc

    if (import.meta.server) {
        const event = useRequestEvent()
        if (event) {
            const raw = event.node.req.headers.cookie || ''
            const parts = raw.split(';').map(s => s.trim()).filter(Boolean).filter(p => !/^locale=/.test(p))
            parts.push(`locale=${loc}`)
            event.node.req.headers.cookie = parts.join('; ')
        }
    }
})
