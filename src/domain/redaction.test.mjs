import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REDACTED_FIELDS, redact } from './redaction.js';

test('REDACTED_FIELDS lists ssn and birthdate', () => {
    assert.deepEqual([...REDACTED_FIELDS].sort(), ['birthdate', 'ssn']);
});

test('redact drops ssn and birthdate and keeps every other key', () => {
    const row = { sisId: '1', ssn: '000000000', birthdate: '20090109', firstName: 'Ann' };
    assert.deepEqual(redact(row), { sisId: '1', firstName: 'Ann' });
});

test('redact does not mutate its input', () => {
    const row = { ssn: '000000000', sisId: '1' };
    redact(row);
    assert.equal(row.ssn, '000000000');
});

test('redact returns null and undefined unchanged', () => {
    assert.equal(redact(null), null);
    assert.equal(redact(undefined), undefined);
});

test('redact matches redacted names regardless of case', async () => {
    assert.deepEqual(redact({ SSN: '1', birthDate: '2', BirthDate: '3', keep: '4' }), { keep: '4' });
});

test('redactDeep removes redacted keys at any depth, inside objects and arrays', async () => {
    const { redactDeep } = await import('./redaction.js');
    const input = { id: '1', ssn: 'x', person: { birthDate: 'y', name: 'Ann', ids: [{ SSN: 'z', type: 'A' }] }, list: [1, null] };
    assert.deepEqual(redactDeep(input), { id: '1', person: { name: 'Ann', ids: [{ type: 'A' }] }, list: [1, null] });
    assert.equal(input.ssn, 'x');
});

test('redactDeep returns primitives unchanged', async () => {
    const { redactDeep } = await import('./redaction.js');
    assert.deepEqual([redactDeep(null), redactDeep('a'), redactDeep(3)], [null, 'a', 3]);
});
