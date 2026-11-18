import { OTHER_RELATIONSHIP } from './records.js';

/**
 * F4 — `pattern` attribute for the Parent/Guardian Name input: letters, apostrophes
 * (' and ’), period, hyphen and space. The hyphen is escaped because browsers compile
 * `pattern` with the `v` flag, where a bare `-` in a class is a syntax error.
 */
export const NAME_PATTERN = "[A-Za-z'’.\\- ]+";

const NAME_REGEX = new RegExp(`^(?:${NAME_PATTERN})$`, 'u');
const PIN_REGEX = /^\d{4}$/;

/** Codes left out of both dropdowns (decision 11). */
export const HIDDEN_CODES = Object.freeze(['D', 'E']);

/** Fields the form edits, named as on the wire. */
const FORM_FIELDS = ['xmommstRelCode', 'xmommstMessage', 'xmommstName', 'xmommstPin', 'xmommstAccCode', 'xmommstStatus'];

const text = (value) => (typeof value === 'string' ? value : '');
const isOther = (form) => form.xmommstRelCode === OTHER_RELATIONSHIP;
const messageFor = (form) => (isOther(form) ? text(form.xmommstMessage).trim() : '');

/** F5 — the name as saved: surrounding spaces removed. */
export const cleanName = (value) => text(value).trim();

/** F5 — whether the trimmed name passes the F4 pattern. */
export const isValidName = (value) => NAME_REGEX.test(cleanName(value));

/**
 * Dropdown options from a lookup list, without D and E — except `current`, the code
 * the edited record already has, so it saves unchanged.
 * @returns {{ value: string, label: string }[]}
 */
export function codeOptions(codes, codeKey, descKey, current) {
    if (!Array.isArray(codes)) return [];
    return codes
        .filter((entry) => !HIDDEN_CODES.includes(entry[codeKey]) || entry[codeKey] === current)
        .map((entry) => ({ value: entry[codeKey], label: entry[descKey] }));
}

/** Form values for a new record. */
export const emptyForm = () => ({
    xmommstRelCode: '', xmommstMessage: '', xmommstName: '', xmommstPin: '', xmommstAccCode: '', xmommstStatus: 'true'
});

/** Form values to edit an existing record. */
export function formFromRecord(record) {
    return Object.fromEntries(FORM_FIELDS.map((field) => [field, text(record[field])]));
}

/** F2 — set the relationship; anything but Other clears the description. */
export function onRelationshipChange(form, code) {
    return { ...form, xmommstRelCode: code, xmommstMessage: code === OTHER_RELATIONSHIP ? form.xmommstMessage : '' };
}

/**
 * F1–F7. Returns `{ field: message }`; empty when the form can be saved.
 * @returns {Record<string, string>}
 */
export function validateRecordForm(form) {
    const errors = {};
    if (!form.xmommstRelCode) errors.xmommstRelCode = 'Relationship to You is required.';
    if (isOther(form) && !messageFor(form)) errors.xmommstMessage = 'Relationship description is required.';
    if (!cleanName(form.xmommstName)) errors.xmommstName = 'Parent/Guardian Name is required.';
    else if (!isValidName(form.xmommstName)) errors.xmommstName = 'The name has invalid characters.';
    if (!PIN_REGEX.test(text(form.xmommstPin))) errors.xmommstPin = 'PIN must be exactly 4 digits.';
    if (!form.xmommstAccCode) errors.xmommstAccCode = 'Scope of Access is required.';
    return errors;
}

const editableBody = (form) => ({
    xmommstRelCode: form.xmommstRelCode,
    xmommstMessage: messageFor(form),
    xmommstName: cleanName(form.xmommstName),
    xmommstAccCode: form.xmommstAccCode,
    xmommstPin: form.xmommstPin
});

/** POST shu-admin-post-zmommst body; the backend sets id, status and dates. */
export function toCreateBody(form, bannerId) {
    return { xbannerId: bannerId, ...editableBody(form) };
}

/**
 * PUT shu-admin-put-zmommst body: the record as received (id, Banner ID, dates, last
 * updated by) with only the editable fields and status taken from the form.
 */
export function toUpdateBody(form, record) {
    return {
        ...record,
        ...editableBody(form),
        xmommstStatus: form.xmommstStatus === 'true' ? 'true' : 'false'
    };
}

/** DELETE shu-delete-zmommst body. */
export const toDeleteBody = (record) => ({ id: record.id });
