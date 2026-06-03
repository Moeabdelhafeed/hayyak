// Map an API service object (list or single) to the shape components expect.
const normalizeApi = (a) => ({
    id: a.id,
    title: a.title || '',
    tag: a.tag || '',
    short: a.short || '',
    desc: a.desc || '',
    img: a.image || '',
    icon: a.icon || '',
    bullets: (a.bullets ?? []).map(b => ({ icon: b.icon || '', text: b.text || '' })),
    hero: a.hero ?? null,
    stats: a.stats ?? [],
    sections: a.sections ?? [],
    cta: a.cta ?? null,
})

// List composable — feeds list page, home preview, nav/footer menus.
export const useServices = () => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res } = useFetch('/api/services', {
        watch: [locale],
        key: 'services',
    })

    return computed(() => {
        const list = res.value?.data
        if (!Array.isArray(list)) return []
        return [...list]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(normalizeApi)
    })
}

// Detail composable — full single service incl. sections.
export const useService = (id) => {
    const locale = useCookie('locale', { default: () => 'en' })

    const { data: res } = useFetch(() => `/api/services/${unref(id)}`, {
        watch: [locale, () => unref(id)],
        key: computed(() => `service-${unref(id)}`),
    })

    return computed(() => {
        const a = res.value?.data
        return a ? normalizeApi(a) : null
    })
}
