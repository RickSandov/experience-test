import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    NAME_PATTERN, HIDDEN_CODES, cleanName, isValidName, codeOptions, emptyForm, formFromRecord,
    onRelationshipChange, validateRecordForm, toCreateBody, toUpdateBody, toDeleteBody
} from './recordForm.js';

const ACC = [
    { zmomaccAccCode: 'E', zmomaccDesc: 'E-Bill (Billing & FinAid)' },
    { zmomaccAccCode: 'A', zmomaccDesc: 'Academic' },
    { zmomaccAccCode: 'D', zmomaccDesc: 'IHS - Data Migration' },
    { zmomaccAccCode: 'B', zmomaccDesc: 'Billing' }
];

const RECORD = Object.freeze({
    id: '301dc70a-bbae-4ec0-aaa7-07bb7c26a68d',
    xbannerId: '12636344',
    xmommstName: 'Javier Calderon',
    xmommstRelCode: 'M',
    xmommstAccCode: 'D',
    xmommstPin: '1234',
    xmommstStatus: 'false',
    xmommstCreatedDt: '2026-11-18',
    xmommstLastActivityDt: '2026-11-19',
    xmommstInactiveDt: '2026-11-20',
    xmommstLastUpdatedBy: 'Ricardo Javier Sandoval',
    xmommstMessage: ''
});

const validForm = (overrides = {}) => ({
    ...emptyForm(),
    xmommstRelCode: 'M',
    xmommstName: 'Javier Calderon',
    xmommstPin: '1234',
    xmommstAccCode: 'B',
    ...overrides
});

// Browsers compile the input `pattern` attribute with the `v` flag, anchored.
const browserPattern = new RegExp(`^(?:${NAME_PATTERN})$`, 'v');

test('F4 the browser pattern compiles with the v flag and accepts letters, apostrophes, hyphen, period and space', () => {
    for (const name of ["O'Neil-Smith Jr.", 'O’Neil', 'Ana María'.replace('í', 'i')]) {
        assert.equal(browserPattern.test(name), true, name);
    }
});

test('F4 the browser pattern rejects digits and other symbols', () => {
    for (const name of ['Ann3', 'Ann_Lee', 'Ann,Lee', 'Ana María']) {
        assert.equal(browserPattern.test(name), false, name);
    }
});

test('F5 cleanName trims the ends only', () => {
    assert.equal(cleanName('  Mary  Ann  '), 'Mary  Ann');
});

test('F5 isValidName checks the trimmed name against the same pattern', () => {
    assert.equal(isValidName('  Javier Calderon '), true);
    assert.equal(isValidName("O'Neil-Smith Jr."), true);
    assert.equal(isValidName('Ann3'), false);
    assert.equal(isValidName('   '), false);
});

test('IB-create.1.xmommstAccCode codeOptions leaves out D and E on create', () => {
    assert.deepEqual(HIDDEN_CODES, ['D', 'E']);
    assert.deepEqual(codeOptions(ACC, 'zmomaccAccCode', 'zmomaccDesc'), [
        { value: 'A', label: 'Academic' },
        { value: 'B', label: 'Billing' }
    ]);
});

test('IB-update.1.xmommstAccCode codeOptions keeps the current hidden code only', () => {
    assert.deepEqual(codeOptions(ACC, 'zmomaccAccCode', 'zmomaccDesc', 'D').map((o) => o.value), ['A', 'D', 'B']);
});

test('codeOptions of codes not loaded yet is empty', () => {
    assert.deepEqual(codeOptions(undefined, 'zmomaccAccCode', 'zmomaccDesc'), []);
});

test('a valid form has no errors', () => {
    assert.deepEqual(validateRecordForm(validForm()), {});
});

test('IB-create.2.xmommstRelCode F1 relationship is required', () => {
    assert.equal(validateRecordForm(validForm({ xmommstRelCode: '' })).xmommstRelCode, 'Relationship to You is required.');
});

test('IB-create.2.xmommstMessage F2 description is required for Other, blank counts as missing', () => {
    assert.equal(validateRecordForm(validForm({ xmommstRelCode: 'O', xmommstMessage: '  ' })).xmommstMessage, 'Relationship description is required.');
    assert.equal(validateRecordForm(validForm({ xmommstRelCode: 'O', xmommstMessage: 'Aunt' })).xmommstMessage, undefined);
});

test('F2 description is not required for other relationships', () => {
    assert.equal(validateRecordForm(validForm({ xmommstRelCode: 'M', xmommstMessage: '' })).xmommstMessage, undefined);
});

test('IB-create.2.xmommstName F3 name is required', () => {
    assert.equal(validateRecordForm(validForm({ xmommstName: '  ' })).xmommstName, 'Parent/Guardian Name is required.');
});

test('IB-create.2.xmommstName F5 a name with invalid characters is rejected', () => {
    assert.equal(validateRecordForm(validForm({ xmommstName: 'Ann3' })).xmommstName, 'The name has invalid characters.');
});

test('IB-create.2.xmommstPin F6 PIN must be exactly 4 digits', () => {
    for (const pin of ['', '123', '12345', '12a4', ' 123']) {
        assert.equal(validateRecordForm(validForm({ xmommstPin: pin })).xmommstPin, 'PIN must be exactly 4 digits.', JSON.stringify(pin));
    }
    assert.equal(validateRecordForm(validForm({ xmommstPin: '0042' })).xmommstPin, undefined);
});

test('IB-create.2.xmommstAccCode F7 scope of access is required', () => {
    assert.equal(validateRecordForm(validForm({ xmommstAccCode: '' })).xmommstAccCode, 'Scope of Access is required.');
});

test('F2 picking another relationship clears the description', () => {
    const form = onRelationshipChange(validForm({ xmommstRelCode: 'O', xmommstMessage: 'Aunt' }), 'M');
    assert.equal(form.xmommstRelCode, 'M');
    assert.equal(form.xmommstMessage, '');
});

test('F2 picking Other keeps what was typed', () => {
    const form = onRelationshipChange(validForm({ xmommstMessage: 'Aunt' }), 'O');
    assert.equal(form.xmommstMessage, 'Aunt');
});

test('IB-create.1 the create body has the searched Banner ID and the trimmed fields, and nothing backend-owned', () => {
    const body = toCreateBody(validForm({ xmommstName: ' Javier Calderon ', xmommstRelCode: 'O', xmommstMessage: ' Aunt ' }), '12636344');
    assert.deepEqual(body, {
        xbannerId: '12636344',
        xmommstRelCode: 'O',
        xmommstMessage: 'Aunt',
        xmommstName: 'Javier Calderon',
        xmommstAccCode: 'B',
        xmommstPin: '1234'
    });
});

test('IB-create.1.xmommstMessage the create body sends an empty description when the relationship is not Other', () => {
    const body = toCreateBody(validForm({ xmommstRelCode: 'M', xmommstMessage: 'stale' }), '12636344');
    assert.equal(body.xmommstMessage, '');
});

test('IB-update.1 the update body carries id, Banner ID, the edited fields and the status string', () => {
    const form = { ...formFromRecord(RECORD), xmommstName: ' Javier C ', xmommstStatus: 'true' };
    const body = toUpdateBody(form, RECORD);
    assert.equal(body.id, RECORD.id);
    assert.equal(body.xbannerId, '12636344');
    assert.equal(body.xmommstName, 'Javier C');
    assert.equal(body.xmommstStatus, 'true');
    assert.equal(body.xmommstAccCode, 'D');
});

test('IB-update.1.dates the update body echoes dates and last updated by as received', () => {
    const body = toUpdateBody(formFromRecord(RECORD), RECORD);
    assert.equal(body.xmommstCreatedDt, '2026-11-18');
    assert.equal(body.xmommstLastActivityDt, '2026-11-19');
    assert.equal(body.xmommstInactiveDt, '2026-11-20');
    assert.equal(body.xmommstLastUpdatedBy, 'Ricardo Javier Sandoval');
});

test('IB-update.1.xbannerId the update body ignores a Banner ID in the form', () => {
    const body = toUpdateBody({ ...formFromRecord(RECORD), xbannerId: '99999999' }, RECORD);
    assert.equal(body.xbannerId, '12636344');
});

test('IB-update.1.xmommstMessage moving away from Other clears the stored description', () => {
    const record = { ...RECORD, xmommstRelCode: 'O', xmommstMessage: 'Aunt' };
    const body = toUpdateBody(onRelationshipChange(formFromRecord(record), 'F'), record);
    assert.equal(body.xmommstMessage, '');
});

test('formFromRecord prefills the editable fields, status included', () => {
    assert.deepEqual(formFromRecord({ ...RECORD, xmommstMessage: undefined }), {
        xmommstRelCode: 'M', xmommstMessage: '', xmommstName: 'Javier Calderon',
        xmommstPin: '1234', xmommstAccCode: 'D', xmommstStatus: 'false'
    });
});

test('IB-delete.1.id the delete body is the id only', () => {
    assert.deepEqual(toDeleteBody(RECORD), { id: RECORD.id });
});
