// Validates the favourites cookie against the API once per client load.
// If a favourited unit was deleted / unpublished (the unit "went away"),
// its id is pruned from the cookie so stale entries never reach the page.
export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return

    const validated = useState('favourites-validated', () => false)
    if (validated.value) return
    validated.value = true

    const { favourites, removeMany } = useFavourites()
    const ids = [...favourites.value]
    if (!ids.length) return

    const invalid = []
    await Promise.all(ids.map(async (id) => {
        try {
            const res = await $fetch(`/api/units/${id}`)
            const unit = res?.data
            if (!unit || res?.status === false || res?.error) invalid.push(id)
        } catch {
            // 404 / network error => unit gone, drop it
            invalid.push(id)
        }
    }))

    if (invalid.length) removeMany(invalid)
})
