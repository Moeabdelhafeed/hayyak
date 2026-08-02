// Normalize CMS body/description text into a clean meta description:
// strip HTML, collapse whitespace, cut on a word boundary near `max` chars.
export const clampMeta = (text, max = 155) => {
    const s = String(text ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    if (s.length <= max) return s
    return s.slice(0, max - 1).replace(/\s+\S*$/, '').trim() + '…'
}
