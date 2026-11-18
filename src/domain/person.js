const namePart = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Whether a shu-admin-get-username response names a person. The pipeline answers
 * 200 with `{}` (or an empty body) for an unknown Banner ID.
 * @param {unknown} response
 * @returns {boolean}
 */
export function isPersonFound(response) {
    if (!response || typeof response !== 'object') return false;
    return Boolean(namePart(response.firstName) || namePart(response.lastName));
}

/**
 * Page heading for a found person: "12636344 - Sandoval, Ricardo Javier".
 * @param {string} bannerId
 * @param {{ firstName?: string, lastName?: string }} person
 * @returns {string}
 */
export function personHeading(bannerId, person) {
    const name = [namePart(person?.lastName), namePart(person?.firstName)].filter(Boolean).join(', ');
    return `${bannerId} - ${name}`;
}
