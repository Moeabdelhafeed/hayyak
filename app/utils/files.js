// Formatting for CMS-attached files and links.

/**
 * Bytes as a short human size: "684 KB", "2.4 MB". 0 / missing returns '' so the caller
 * can simply not render the size when the CMS has not sent one.
 */
export const fmtBytes = (bytes) => {
    const n = Number(bytes)
    if (!Number.isFinite(n) || n <= 0) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let v = n
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024
        i++
    }
    // One decimal from MB up ("2.4 MB"), none below it ("684 KB") — a tenth of a KB is noise.
    return `${i >= 2 ? v.toFixed(1) : Math.round(v)} ${units[i]}`
}

/**
 * The host of a link, for showing where an outbound link goes. '' for anything that is
 * not a parseable absolute URL — the CMS field is editor-entered, so that happens.
 */
export const hostOf = (url) => {
    try {
        return new URL(String(url)).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}
