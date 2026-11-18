import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoleList, resolveAccess } from './access.js';

test('a comma-separated role string is trimmed and empty entries dropped', () => {
    assert.deepEqual(parseRoleList(' ADMIN, REGISTRAR ,,'), ['ADMIN', 'REGISTRAR']);
});

test('a role array is trimmed and empty entries dropped', () => {
    assert.deepEqual(parseRoleList(['ADMIN', ' ', ' STAFF ']), ['ADMIN', 'STAFF']);
});

test('a missing role list is empty', () => {
    assert.deepEqual(parseRoleList(undefined), []);
    assert.deepEqual(parseRoleList(null), []);
});

test('empty or missing role configuration denies read and write', () => {
    assert.deepEqual(resolveAccess(['ADMIN'], {}), { canRead: false, canWrite: false });
    assert.deepEqual(resolveAccess(['ADMIN'], undefined), { canRead: false, canWrite: false });
    assert.deepEqual(resolveAccess(['ADMIN'], { writeAccessRoles: '', readAccessRoles: ' , ' }), { canRead: false, canWrite: false });
});

test('a write role also grants read', () => {
    assert.deepEqual(resolveAccess(['ADMIN'], { writeAccessRoles: 'ADMIN' }), { canRead: true, canWrite: true });
});

test('a read role grants read only', () => {
    assert.deepEqual(
        resolveAccess(['STAFF'], { writeAccessRoles: 'ADMIN', readAccessRoles: 'STAFF' }),
        { canRead: true, canWrite: false }
    );
});

test('a user with neither role gets no access', () => {
    assert.deepEqual(
        resolveAccess(['STUDENT'], { writeAccessRoles: 'ADMIN', readAccessRoles: 'STAFF' }),
        { canRead: false, canWrite: false }
    );
});

test('roles match exactly, not by substring or case', () => {
    assert.deepEqual(
        resolveAccess(['ADMIN-LITE', 'admin'], { writeAccessRoles: 'ADMIN' }),
        { canRead: false, canWrite: false }
    );
});

test('missing user roles get no access', () => {
    assert.deepEqual(resolveAccess(undefined, { writeAccessRoles: 'ADMIN' }), { canRead: false, canWrite: false });
});
