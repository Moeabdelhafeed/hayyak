import enBase from '../../../translations.en.json'
import arBase from '../../../translations.ar.json'

export default defineEventHandler(async (event) => {
    const lang = getCookie(event, 'locale')
    const config = useRuntimeConfig()

    const base = lang === 'ar' ? arBase : enBase

    let remote = {}
    try {
        const res = await $fetch(`${config.baseUrl}/general/translations`, {
            query: { group: 'website' },
            headers: {
                'X-API-TOKEN': config.publicToken,
                'Accept-Language': lang,
            },
        })
        remote = res?.data ?? res ?? {}
    } catch {}

    // local JSON is the base; backend values override it
    return { ...base, ...remote }
})
