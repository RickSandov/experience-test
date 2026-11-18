/** Placeholder for empty cells. */
export const EMPTY_VALUE = '—';

const LOCALE = 'en-US';
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const COMPACT_DATE = /^(\d{4})(\d{2})(\d{2})$/;
const DATE_TIME = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:?\d{2})?$/;

/** Intl output uses narrow no-break spaces before AM/PM; plain spaces read the same and copy cleanly. */
const plainSpaces = (text) => text.replace(/[\u202f\u00a0]/g, ' ');

/** A calendar day as a UTC Date, or null when the day does not exist (2026-02-30). */
function calendarDay(year, month, day) {
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    const valid = date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
    return valid ? date : null;
}

const dayText = (date) => plainSpaces(date.toLocaleDateString(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' }));

/**
 * Readable text for a date value, or null when the value is not a recognized date:
 * - 'YYYY-MM-DD' → 'Nov 9, 2026' (a calendar day, never shifted by time zone)
 * - ISO date-time ('2026-11-01T08:05:00Z', Banner's '...000+0000') → 'Nov 1, 2026, 8:05 AM'
 *   in `timeZone` (default: the browser's); exactly midnight UTC is how Banner sends
 *   calendar dates, so it shows as the day alone
 * - 'YYYYMMDD' (flat-file exports, e.g. Slate) → 'Nov 2, 2026', only with `compact: true`, since eight
 *   digits alone may be an ID
 * @param {unknown} value
 * @param {{ timeZone?: string, compact?: boolean }} [options]
 * @returns {string|null}
 */
export function formatDate(value, { timeZone, compact = false } = {}) {
    if (typeof value !== 'string') return null;

    const dayMatch = value.match(DATE_ONLY) ?? (compact ? value.match(COMPACT_DATE) : null);
    if (dayMatch) {
        const date = calendarDay(dayMatch[1], dayMatch[2], dayMatch[3]);
        return date ? dayText(date) : null;
    }

    const timeMatch = value.match(DATE_TIME);
    if (!timeMatch) return null;
    const [, day, time, zone] = timeMatch;
    if (!calendarDay(...day.split('-'))) return null;
    // Banner sends '+0000'; Safari only parses ISO offsets with a colon ('+00:00').
    const offset = zone && zone !== 'Z' && !zone.includes(':') ? `${zone.slice(0, 3)}:${zone.slice(3)}` : zone ?? '';
    const date = new Date(`${day}T${time}${offset}`);
    if (Number.isNaN(date.getTime())) return null;
    if (zone && date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0) {
        return dayText(date);
    }
    return plainSpaces(date.toLocaleString(LOCALE, { dateStyle: 'medium', timeStyle: 'short', timeZone }));
}

/** Readable date-time for display; empty → placeholder; not a recognized date → shown as received. */
export function formatDateTime(value, options) {
    if (!value) return EMPTY_VALUE;
    return formatDate(value, options) ?? String(value);
}

/** Cell text: the placeholder for '', null or undefined; everything else as a string. */
export const displayValue = (value) => (value === '' || value == null ? EMPTY_VALUE : String(value));
