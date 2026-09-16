// The layout and the EN/AR switcher depend on this on EVERY page. When the CMS is
// unreachable a throw here 500s the whole site and the language toggle disappears,
// so fall back to the two locales nuxt.config already declares.
const FALLBACK = {
    data: [
        { locale: 'en', name: 'English', direction: 'ltr', is_default: true },
        { locale: 'ar', name: 'العربية', direction: 'rtl', is_default: false },
    ],
}

export default defineEventHandler(async (event) => {
    try {
        const res = await cmsFetch(event, 'general/languages')
        return Array.isArray(res?.data) && res.data.length ? res : FALLBACK
    } catch {
        return FALLBACK
    }
})
