import { MOCK_IDS } from './fixtures.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const isoDay = (date) => date.toISOString().slice(0, 10);
const MOCK_USER = 'Mock Admin';

const notFound = () => new Error('Record not found');
const writeFailure = () => new Error('Mock pipeline error: write rejected');

/**
 * In-memory stand-in for the XMOMMST pipelines, following the contract's backend
 * rules: the store sets id, status, dates and last updated by. Errors carry the
 * message a pipeline would send in `{ message }`.
 * @param {{ people, records, relationships, access }} fixtures
 * @param {{ now?: () => Date, newId?: () => string }} [options]
 */
export function createMockStore(fixtures, { now = () => new Date(), newId = () => globalThis.crypto.randomUUID() } = {}) {
    let records = clone(fixtures.records);
    const people = clone(fixtures.people);

    const today = () => isoDay(now());
    const guardWrite = (bannerId) => {
        if (bannerId === MOCK_IDS.writeFails) throw writeFailure();
    };
    const indexOf = (id) => {
        const index = records.findIndex((record) => record.id === id);
        if (index < 0) throw notFound();
        return index;
    };

    return {
        username: (bannerId) => clone(people[bannerId] ?? {}),
        list: (bannerId) => clone(records.filter((record) => record.xbannerId === bannerId)),
        relationships: () => clone(fixtures.relationships),
        access: () => clone(fixtures.access),

        create(body) {
            guardWrite(body.xbannerId);
            const record = {
                ...clone(body),
                id: newId(),
                xmommstStatus: 'true',
                xmommstCreatedDt: today(),
                xmommstLastActivityDt: today(),
                xmommstLastUpdatedBy: MOCK_USER
            };
            records.push(record);
            return clone(record);
        },

        update(body) {
            const index = indexOf(body.id);
            guardWrite(records[index].xbannerId);
            const record = {
                ...clone(body),
                xmommstLastActivityDt: today(),
                xmommstLastUpdatedBy: MOCK_USER
            };
            if (record.xmommstStatus === 'false') record.xmommstInactiveDt = records[index].xmommstInactiveDt ?? today();
            else delete record.xmommstInactiveDt;
            records[index] = record;
            return clone(record);
        },

        remove({ id }) {
            const index = indexOf(id);
            guardWrite(records[index].xbannerId);
            records = records.filter((_, i) => i !== index);
        }
    };
}
