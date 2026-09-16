import enBase from '../../../translations.en.json'
import arBase from '../../../translations.ar.json'

export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')

    const base = lang === 'ar' ? arBase : enBase

    let remote = {}
    try {
        const res = await cmsFetch(event, 'general/translations', { query: { group: 'website' } })
        remote = res?.data ?? res ?? {}
    } catch {}

    // local JSON is the base; backend values override it
    return { ...base, ...remote }
})
