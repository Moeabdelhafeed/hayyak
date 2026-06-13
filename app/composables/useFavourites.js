import { computed, watch } from 'vue'

// Favourited units are stored as an array of unit ids in the `favouriteUnits` cookie.
// State is mirrored into useState so every component shares one reactive source,
// and written back to the cookie on the client so it survives reloads/sessions.
export const useFavourites = () => {
    const cookie = useCookie('favouriteUnits', { default: () => [], path: '/' })

    const favourites = useState('favourite-units', () =>
        Array.isArray(cookie.value) ? cookie.value.map(Number).filter(n => !Number.isNaN(n)) : [],
    )

    if (import.meta.client) {
        watch(favourites, (val) => {
            cookie.value = val
        }, { deep: true })
    }

    const isFavourite = (id) => favourites.value.includes(Number(id))

    const toggle = (id) => {
        const n = Number(id)
        if (Number.isNaN(n)) return
        if (favourites.value.includes(n)) {
            favourites.value = favourites.value.filter(x => x !== n)
        } else {
            favourites.value = [...favourites.value, n]
        }
    }

    const remove = (id) => {
        const n = Number(id)
        favourites.value = favourites.value.filter(x => x !== n)
    }

    const removeMany = (ids) => {
        const set = new Set(ids.map(Number))
        favourites.value = favourites.value.filter(x => !set.has(x))
    }

    const count = computed(() => favourites.value.length)

    return { favourites, isFavourite, toggle, remove, removeMany, count }
}
