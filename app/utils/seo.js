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

// Detail pages must never render without their record. Before this, a missing or
// failed CMS response left the title as the literal string "undefined" (measured:
// 142/194 EN property pages under a concurrent crawl) or an English placeholder like
// "Area", with no description — indexable duplicates instead of an honest status.
//
// The distinction matters: a genuinely absent record is a 404, but an upstream
// failure must be a 503 so Google retries instead of deindexing a live page.
export const requireRecord = (record, error) => {
    if (record) return
    throw createError({
        statusCode: unref(error) ? 503 : 404,
        statusMessage: unref(error) ? 'Content temporarily unavailable' : 'Not found',
        fatal: true,
    })
}
