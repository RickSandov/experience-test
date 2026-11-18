import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageView } from './pagination.js';

test('page and size come from the offset and limit the backend applied', () => {
    const view = pageView({ total: 120, offset: 50, limit: 50 }, { offset: 50, limit: 100 });
    assert.deepEqual({ page: view.page, rowsPerPage: view.rowsPerPage, count: view.count }, { page: 1, rowsPerPage: 50, count: 120 });
});

test('moving to a page uses the applied size, so no rows are skipped after a cap', () => {
    const view = pageView({ total: 120, offset: 50, limit: 50 }, { offset: 50, limit: 100 });
    assert.equal(view.offsetOfPage(2), 100);
});

test('the requested values are the fallback when the response lacks them', () => {
    const view = pageView({ total: 30 }, { offset: 25, limit: 25 });
    assert.deepEqual({ page: view.page, rowsPerPage: view.rowsPerPage }, { page: 1, rowsPerPage: 25 });
    assert.equal(view.offsetOfPage(0), 0);
});

test('a zero or missing limit never divides by zero', () => {
    const view = pageView({ total: 0, offset: 0, limit: 0 }, { offset: 0, limit: 0 });
    assert.deepEqual({ page: view.page, rowsPerPage: view.rowsPerPage }, { page: 0, rowsPerPage: 25 });
});

test('a missing total counts as zero', () => {
    assert.equal(pageView(undefined, { offset: 0, limit: 25 }).count, 0);
});
