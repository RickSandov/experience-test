import { EMPTY_VALUE, displayValue, formatDateTime } from './format.js';

/** Relationship code whose description travels in xmommstMessage. */
export const OTHER_RELATIONSHIP = 'O';

/**
 * A date as received with whitespace removed ("2026-11 - 18" → "2026-11-18").
 * @param {string|null|undefined} value
 */
export const cleanDate = (value) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value);

/**
 * Description of a code from a lookup list; the raw code when it is not in the list
 * (or the list is not loaded); the placeholder when there is no code.
 * @param {string} code
 * @param {object[]|undefined} codes - shu-get-zmomrel or shu-get-zmomacc response
 * @param {string} codeKey - e.g. 'zmomrelRelCode'
 * @param {string} descKey - e.g. 'zmomrelDesc'
 * @returns {string}
 */
export function codeLabel(code, codes, codeKey, descKey) {
    if (!code) return EMPTY_VALUE;
    const match = Array.isArray(codes) ? codes.find((entry) => entry?.[codeKey] === code) : undefined;
    return match?.[descKey] || code;
}

const formatRecordDate = (value) => formatDateTime(cleanDate(value));

/**
 * Table row for an XMOMMST record.
 * @param {object} record - one item of shu-admin-get-zmommst
 * @param {{ rel?: object[], acc?: object[] }} lookups
 */
export function toRecordRow(record, { rel, acc } = {}) {
    return {
        id: record.id,
        name: displayValue(record.xmommstName),
        relationship: codeLabel(record.xmommstRelCode, rel, 'zmomrelRelCode', 'zmomrelDesc'),
        relationshipDescription: record.xmommstRelCode === OTHER_RELATIONSHIP ? (record.xmommstMessage ?? '') : '',
        access: codeLabel(record.xmommstAccCode, acc, 'zmomaccAccCode', 'zmomaccDesc'),
        pin: displayValue(record.xmommstPin),
        status: record.xmommstStatus === 'true' ? 'Active' : 'Inactive',
        created: formatRecordDate(record.xmommstCreatedDt),
        lastActivity: formatRecordDate(record.xmommstLastActivityDt),
        inactive: formatRecordDate(record.xmommstInactiveDt),
        lastUpdatedBy: displayValue(record.xmommstLastUpdatedBy),
        record
    };
}
