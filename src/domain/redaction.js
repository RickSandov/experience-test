/**
 * PII fields that must never be rendered, even if a response includes them. Set the list per project.
 * The backend is expected to omit them; this is the UI-side second guard. Matching
 * ignores case, so Banner-style names such as `birthDate` are caught too.
 */
export const REDACTED_FIELDS = Object.freeze(['ssn', 'birthdate']);

/** True when a field name is a redacted one, in any letter case. */
export const isRedactedKey = (key) => REDACTED_FIELDS.includes(String(key).toLowerCase());

/**
 * Returns a shallow copy of `obj` without any redacted key.
 * null/undefined are returned unchanged.
 * @param {object|null|undefined} obj
 * @returns {object|null|undefined}
 */
export function redact(obj) {
    if (obj == null) return obj;
    return Object.fromEntries(Object.entries(obj).filter(([key]) => !isRedactedKey(key)));
}

/**
 * Deep copy of `value` without redacted keys at any depth (objects and arrays).
 * Primitives are returned unchanged. Use before rendering nested values.
 * @param {*} value
 * @returns {*}
 */
export function redactDeep(value) {
    if (Array.isArray(value)) return value.map(redactDeep);
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).filter(([key]) => !isRedactedKey(key)).map(([key, item]) => [key, redactDeep(item)]),
        );
    }
    return value;
}
