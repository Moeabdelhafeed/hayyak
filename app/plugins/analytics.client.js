// GA4 via @nuxt/scripts. Fires an initial page_view on load and one on every
// SPA route change, and exposes $track(event, params) for conversion events.
export default defineNuxtPlugin(() => {
    const id = useRuntimeConfig().public.gtagId
    if (!id) {
        return { provide: { track: () => {} } }
    }

    const { proxy } = useScriptGoogleAnalytics({ id })
    const router = useRouter()

    // gtag config already sends the first page_view; skip the initial afterEach
    // to avoid double-counting the landing page.
    let first = true
    router.afterEach((to) => {
        if (first) {
            first = false
            return
        }
        proxy.gtag('event', 'page_view', {
            page_path: to.fullPath,
            page_location: typeof window !== 'undefined' ? window.location.href : undefined,
            page_title: typeof document !== 'undefined' ? document.title : undefined,
        })
    })

    return {
        provide: {
            track: (event, params = {}) => {
                try { proxy.gtag('event', event, params) } catch { /* no-op */ }
            },
        },
    }
})
