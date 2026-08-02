// Shared client-side form validation — blocks bad input before hitting the API.
export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v ?? '').trim())

// Accepts +, spaces, dashes, parens; requires 7–15 actual digits.
export const isValidPhone = (v) => {
    const digits = String(v ?? '').replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
}
