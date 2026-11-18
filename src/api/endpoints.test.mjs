import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PIPELINES, MOCK, usernameUrl, zmommstUrl, requestErrorMessage } from './endpoints.js';

test('the seven pipelines from the contract are named exactly', () => {
    assert.deepEqual(PIPELINES, {
        username: 'shu-admin-get-username',
        zmommst: 'shu-admin-get-zmommst',
        zmomrel: 'shu-get-zmomrel',
        zmomacc: 'shu-get-zmomacc',
        create: 'shu-admin-post-zmommst',
        update: 'shu-admin-put-zmommst',
        remove: 'shu-delete-zmommst'
    });
});

test('pipeline names have no leading slash', () => {
    for (const name of Object.values(PIPELINES)) assert.ok(!name.startsWith('/'), name);
});

test('every endpoint group has a mock flag', () => {
    assert.deepEqual(Object.keys(MOCK).sort(), ['username', 'write', 'zmomacc', 'zmommst', 'zmomrel']);
    for (const flag of Object.values(MOCK)) assert.equal(typeof flag, 'boolean');
});

test('the username URL passes the Banner ID as bannerId', () => {
    assert.equal(usernameUrl('12636344'), 'shu-admin-get-username?bannerId=12636344');
});

test('the records URL passes the Banner ID as bannerId', () => {
    assert.equal(zmommstUrl('12636344'), 'shu-admin-get-zmommst?bannerId=12636344');
});

test('the Banner ID is URL-encoded', () => {
    assert.equal(zmommstUrl('1 2&3'), 'shu-admin-get-zmommst?bannerId=1%202%263');
});

test('an error body with a message is shown as is', () => {
    assert.equal(requestErrorMessage(400, { message: 'PIN already in use' }), 'PIN already in use');
});

test('an error without a message shows the status', () => {
    assert.equal(requestErrorMessage(500, null), 'Request failed (500)');
    assert.equal(requestErrorMessage(502, { message: '  ' }), 'Request failed (502)');
    assert.equal(requestErrorMessage(404, 'Not Found'), 'Request failed (404)');
});
