import { setCookie, getQuery, parseCookies } from 'h3'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const locale = query.locale
    if (!locale || !['en', 'ar'].includes(locale)) return

    setCookie(event, 'locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })

    const cookies = parseCookies(event)
    cookies.locale = locale
    event.node.req.headers.cookie = Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ')
})
