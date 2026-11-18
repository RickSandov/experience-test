import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMockStore } from './mockStore.js';
import { FIXTURES, MOCK_IDS } from './fixtures.js';

const NOW = () => new Date('2026-11-18T15:00:00Z');
const store = () => createMockStore(FIXTURES, { now: NOW });

const newRecord = {
    xbannerId: MOCK_IDS.withRecords,
    xmommstRelCode: 'F',
    xmommstMessage: '',
    xmommstName: 'Juan Perez',
    xmommstAccCode: 'A',
    xmommstPin: '4321'
};

test('fixture Banner IDs cover a person with records, one without and an unknown one', () => {
    const s = store();
    assert.ok(s.list(MOCK_IDS.withRecords).length > 0);
    assert.deepEqual(s.list(MOCK_IDS.noRecords), []);
    assert.ok(s.username(MOCK_IDS.noRecords).lastName);
    assert.deepEqual(s.username(MOCK_IDS.unknown), {});
});

test('fixtures include an Other record with a description and a record with access D', () => {
    const records = store().list(MOCK_IDS.withRecords);
    assert.ok(records.some((r) => r.xmommstRelCode === 'O' && r.xmommstMessage));
    assert.ok(records.some((r) => r.xmommstAccCode === 'D'));
});

test('fixture records have clean dates', () => {
    for (const r of store().list(MOCK_IDS.withRecords)) {
        assert.match(r.xmommstCreatedDt, /^\d{4}-\d{2}-\d{2}$/);
        assert.doesNotMatch(r.id, /\s/);
    }
});

test('a created record is listed with the backend-owned fields set', () => {
    const s = store();
    s.create(newRecord);
    const created = s.list(MOCK_IDS.withRecords).find((r) => r.xmommstName === 'Juan Perez');
    assert.ok(created.id);
    assert.equal(created.xmommstStatus, 'true');
    assert.equal(created.xmommstCreatedDt, '2026-11-18');
    assert.equal(created.xmommstLastActivityDt, '2026-11-18');
    assert.ok(created.xmommstLastUpdatedBy);
});

test('an update replaces the record and marks it inactive when status turns false', () => {
    const s = store();
    const [first] = s.list(MOCK_IDS.withRecords);
    s.update({ ...first, xmommstName: 'Renamed', xmommstStatus: 'false', xmommstInactiveDt: undefined });
    const updated = s.list(MOCK_IDS.withRecords).find((r) => r.id === first.id);
    assert.equal(updated.xmommstName, 'Renamed');
    assert.equal(updated.xmommstInactiveDt, '2026-11-18');
});

test('a removed record is no longer listed', () => {
    const s = store();
    const [first] = s.list(MOCK_IDS.withRecords);
    s.remove({ id: first.id });
    assert.equal(s.list(MOCK_IDS.withRecords).some((r) => r.id === first.id), false);
});

test('updating or removing an unknown id fails with a message', () => {
    const s = store();
    assert.throws(() => s.update({ ...newRecord, id: 'nope' }), { message: 'Record not found' });
    assert.throws(() => s.remove({ id: 'nope' }), { message: 'Record not found' });
});

test('writes for the failing Banner ID fail with a message', () => {
    const s = store();
    assert.throws(() => s.create({ ...newRecord, xbannerId: MOCK_IDS.writeFails }), { message: /mock/i });
});

test('stores do not share state and list returns copies', () => {
    const a = store();
    a.list(MOCK_IDS.withRecords)[0].xmommstName = 'Mutated';
    a.create(newRecord);
    assert.notEqual(a.list(MOCK_IDS.withRecords)[0].xmommstName, 'Mutated');
    assert.equal(store().list(MOCK_IDS.withRecords).some((r) => r.xmommstName === 'Juan Perez'), false);
});
