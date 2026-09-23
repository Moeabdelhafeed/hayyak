// Unit records embed their tags as `{id, name, type, color}` and that `name` comes back
// in English whatever the Accept-Language is — only the standalone /api/tags endpoint
// localizes it. So an Arabic property card showed "Featured" while the CMS holds "مميز".
//
// Join on id against the localized list. If the CMS ever starts embedding a
// translations[] on the tag itself, that wins without another change here.
export const useTagNames = () => {
  const locale = useCookie('locale', { default: () => 'en', path: '/' })

  // Not lazy: the names are rendered in the SSR HTML, and resolving them on the
  // client instead would flash the English tag and trip a hydration mismatch.
  const { data } = useFetch('/api/tags', {
    watch: [locale],
    key: computed(() => `tag-names-${locale.value}`),
  })

  const byId = computed(() => {
    const m = new Map()
    for (const t of data.value?.data ?? []) {
      if (t?.id != null && t?.name) m.set(String(t.id), t.name)
    }
    return m
  })

  const tagName = (tag) => {
    if (!tag) return ''
    if (typeof tag === 'string') return tag
    const embedded = (tag.translations ?? []).find((tr) => tr.lang === locale.value)?.name
    return embedded || (tag.id != null && byId.value.get(String(tag.id))) || tag.name || ''
  }

  // Every call site wanted the same {name, color} shape.
  const mapTags = (tags) =>
    (tags ?? [])
      .map((tg) =>
        typeof tg === 'string'
          ? { name: tg, color: '' }
          : { name: tagName(tg), color: tg?.color || '' },
      )
      .filter((t) => t.name)

  return { tagName, mapTags }
}
