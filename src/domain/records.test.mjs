import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_VALUE } from './format.js';
import { cleanDate, codeLabel, toRecordRow, upsertRecord, removeRecord, isRecord } from './records.js';

const REL = [
    { zmomrelRelCode: 'M', zmomrelDesc: 'Mother' },
    { zmomrelRelCode: 'O', zmomrelDesc: 'Other' }
];
const ACC = [{ zmomaccAccCode: 'B', zmomaccDesc: 'Billing' }];
const LOOKUPS = { rel: REL, acc: ACC };

const record = (overrides = {}) => ({
    id: '974df631-30ec-48e3-ac54-e65bad093d76',
    xbannerId: '12636344',
    xmommstName: 'Javier Sandoval',
    xmommstRelCode: 'M',
    xmommstAccCode: 'B',
    xmommstPin: '1234',
    xmommstStatus: 'true',
    xmommstCreatedDt: '2026-11-18',
    xmommstLastActivityDt: '2026-11-18',
    xmommstLastUpdatedBy: 'Ricardo Javier Sandoval',
    xmommstMessage: '',
    ...overrides
});

test('cleanDate removes whitespace inside a date', () => {
    assert.equal(cleanDate('2026-11 - 18'), '2026-11-18');
    assert.equal(cleanDate(' 2026 - 11 - 18 '), '2026-11-18');
});

test('cleanDate leaves a missing date missing', () => {
    assert.equal(cleanDate(undefined), undefined);
    assert.equal(cleanDate(null), null);
});

test('codeLabel shows the description of a known code', () => {
    assert.equal(codeLabel('M', REL, 'zmomrelRelCode', 'zmomrelDesc'), 'Mother');
});

test('codeLabel shows the raw code when the code is unknown', () => {
    assert.equal(codeLabel('Z', REL, 'zmomrelRelCode', 'zmomrelDesc'), 'Z');
});

test('codeLabel shows the raw code while the codes are not loaded', () => {
    assert.equal(codeLabel('M', undefined, 'zmomrelRelCode', 'zmomrelDesc'), 'M');
});

test('codeLabel shows the placeholder for a missing code', () => {
    assert.equal(codeLabel('', REL, 'zmomrelRelCode', 'zmomrelDesc'), EMPTY_VALUE);
});

test('a row shows names for the relationship and access codes', () => {
    const row = toRecordRow(record(), LOOKUPS);
    assert.equal(row.relationship, 'Mother');
    assert.equal(row.access, 'Billing');
});

test('a row shows the name, PIN and last updated by as received', () => {
    const row = toRecordRow(record(), LOOKUPS);
    assert.equal(row.id, '974df631-30ec-48e3-ac54-e65bad093d76');
    assert.equal(row.name, 'Javier Sandoval');
    assert.equal(row.pin, '1234');
    assert.equal(row.lastUpdatedBy, 'Ricardo Javier Sandoval');
});

test('a row formats cleaned dates and shows the placeholder for a missing one', () => {
    const row = toRecordRow(record({ xmommstCreatedDt: '2026-11 - 18' }), LOOKUPS);
    assert.equal(row.created, 'Nov 18, 2026');
    assert.equal(row.lastActivity, 'Nov 18, 2026');
    assert.equal(row.inactive, EMPTY_VALUE);
});

test('status "true" is Active and "false" is Inactive', () => {
    assert.equal(toRecordRow(record({ xmommstStatus: 'true' }), LOOKUPS).status, 'Active');
    assert.equal(toRecordRow(record({ xmommstStatus: 'false' }), LOOKUPS).status, 'Inactive');
});

test('the relationship description shows only for Other', () => {
    assert.equal(toRecordRow(record({ xmommstRelCode: 'O', xmommstMessage: 'Aunt' }), LOOKUPS).relationshipDescription, 'Aunt');
    assert.equal(toRecordRow(record({ xmommstRelCode: 'M', xmommstMessage: 'stale' }), LOOKUPS).relationshipDescription, '');
});

test('a row keeps the raw record for edit and delete', () => {
    const raw = record();
    assert.equal(toRecordRow(raw, LOOKUPS).record, raw);
});

test('upsertRecord replaces the record with the same id in place', () => {
    const list = [record({ id: 'a', xmommstName: 'Old' }), record({ id: 'b' })];
    const next = upsertRecord(list, record({ id: 'a', xmommstName: 'New' }));
    assert.deepEqual(next.map((r) => [r.id, r.xmommstName]), [['a', 'New'], ['b', 'Javier Sandoval']]);
});

test('upsertRecord appends a record with a new id', () => {
    const next = upsertRecord([record({ id: 'a' })], record({ id: 'c' }));
    assert.deepEqual(next.map((r) => r.id), ['a', 'c']);
});

test('upsertRecord does not mutate the cached list', () => {
    const list = [record({ id: 'a' })];
    upsertRecord(list, record({ id: 'c' }));
    assert.equal(list.length, 1);
});

test('upsertRecord on a list that is not loaded starts a new list', () => {
    assert.deepEqual(upsertRecord(undefined, record({ id: 'a' })).map((r) => r.id), ['a']);
});

test('removeRecord drops only the record with that id', () => {
    const next = removeRecord([record({ id: 'a' }), record({ id: 'b' })], 'a');
    assert.deepEqual(next.map((r) => r.id), ['b']);
});

test('removeRecord on a list that is not loaded leaves it unloaded', () => {
    assert.equal(removeRecord(undefined, 'a'), undefined);
});

test('isRecord accepts a response with an id and rejects empty responses', () => {
    assert.equal(isRecord(record()), true);
    assert.equal(isRecord({}), false);
    assert.equal(isRecord(null), false);
    assert.equal(isRecord([record()]), false);
});
