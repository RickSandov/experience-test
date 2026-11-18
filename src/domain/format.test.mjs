import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_VALUE, formatDate, formatDateTime, displayValue } from './format.js';

const UTC = { timeZone: 'UTC' };

test('a missing date shows the empty placeholder', () => {
    assert.equal(formatDateTime(null), EMPTY_VALUE);
    assert.equal(formatDateTime(''), EMPTY_VALUE);
});

test('an unparseable date is shown as received instead of Invalid Date', () => {
    assert.equal(formatDateTime('20261110'), '20261110');
});

test('an ISO date-time is shown as a readable date and time', () => {
    assert.equal(formatDateTime('2026-11-01T08:05:00Z', UTC), 'Nov 1, 2026, 8:05 AM');
});

test('a date-time is shown in the given time zone', () => {
    assert.equal(formatDateTime('2026-11-01T08:05:00Z', { timeZone: 'America/Puerto_Rico' }), 'Nov 1, 2026, 4:05 AM');
});

test('Banner offsets without a colon parse like ISO offsets', () => {
    assert.equal(formatDateTime('2026-10-09T21:14:40.000+0000', UTC), 'Oct 9, 2026, 9:14 PM');
    assert.equal(formatDateTime('2026-10-09T21:14:40-0400', UTC), 'Oct 10, 2026, 1:14 AM');
});

test('a date-only value is shown as that calendar day in any time zone', () => {
    assert.equal(formatDateTime('2026-11-09', { timeZone: 'America/Puerto_Rico' }), 'Nov 9, 2026');
});

test('midnight UTC is a Banner calendar date, shown without a time and not shifted', () => {
    assert.equal(formatDateTime('2027-06-01T00:00:00.000+0000', { timeZone: 'America/Puerto_Rico' }), 'Jun 1, 2027');
});

test('formatDate: unrecognized values give null, so callers fall back to the raw value', () => {
    assert.deepEqual(['202820', '20261102', 'abc', '2026-13-01', '2026-02-30', 5, null].map((value) => formatDate(value)), [null, null, null, null, null, null, null]);
});

test('formatDate: a date-time on a day that does not exist is not a date', () => {
    assert.equal(formatDate('2026-02-30T10:00:00Z'), null);
});

test('formatDate: compact YYYYMMDD dates only when the caller says the field is a date', () => {
    assert.equal(formatDate('20261102', { compact: true }), 'Nov 2, 2026');
    assert.equal(formatDate('20261340', { compact: true }), null);
});

test('displayValue shows the placeholder only for empty values', () => {
    assert.deepEqual([displayValue(''), displayValue(null), displayValue(undefined), displayValue(0), displayValue('UG')], [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE, '0', 'UG']);
});
