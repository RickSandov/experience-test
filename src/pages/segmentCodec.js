/*
 * Route path segment codec for react-router v5 / history v4.
 * history v4 runs decodeURI on every pathname it stores and pushes, which decodes %25 and
 * %20 but keeps %2F, so a percent-encoded value (a file name, an ID with spaces) cannot be
 * recovered reliably from useParams. Segments therefore carry no '%': the
 * encodeURIComponent escapes use '~' instead (a literal '~' is escaped first as ~7E).
 * decodeURI leaves such a segment unchanged, so useParams returns it intact.
 */
export const encodeSegment = (value) => encodeURIComponent(String(value)).replace(/~/g, '~7E').replace(/%/g, '~');

/** Reverses encodeSegment; hand-typed invalid input is returned as is. */
export function decodeSegment(value) {
    if (value == null) return '';
    try {
        return decodeURIComponent(String(value).replace(/~/g, '%'));
    } catch {
        return String(value);
    }
}
