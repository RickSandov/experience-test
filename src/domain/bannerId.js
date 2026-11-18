/** Banner IDs are exactly eight digits. */
export const BANNER_ID_LENGTH = 8;

const VALID_BANNER_ID = /^\d{8}$/;

/**
 * What the search field keeps from what the user typed: digits only, at most eight.
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeBannerIdInput(raw) {
    if (raw == null) return '';
    return String(raw).replace(/\D/g, '').slice(0, BANNER_ID_LENGTH);
}

/**
 * Whether a value is a complete Banner ID, the only value that triggers a lookup.
 * @param {unknown} value
 * @returns {boolean}
 */
export const isValidBannerId = (value) => typeof value === 'string' && VALID_BANNER_ID.test(value);
