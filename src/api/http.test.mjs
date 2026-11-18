import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readJsonResponse } from './http.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

test('a 200 with JSON returns the parsed body', async () => {
    assert.deepEqual(await readJsonResponse(json({ firstName: 'Ana' })), { firstName: 'Ana' });
});

test('a 200 with an empty body returns null instead of failing', async () => {
    assert.equal(await readJsonResponse(new Response('', { status: 200 })), null);
});

test('a 204 returns null', async () => {
    assert.equal(await readJsonResponse(new Response(null, { status: 204 })), null);
});

test('a 201 is a success', async () => {
    assert.deepEqual(await readJsonResponse(json({ id: 'x' }, 201)), { id: 'x' });
});

test('an error status throws the contract message', async () => {
    await assert.rejects(readJsonResponse(json({ message: 'PIN already in use' }, 400)), { message: 'PIN already in use' });
});

test('an error status with a non-JSON body throws the status', async () => {
    await assert.rejects(readJsonResponse(new Response('<html>Bad gateway</html>', { status: 502 })), { message: 'Request failed (502)' });
});

test('a 3xx is not a success', async () => {
    await assert.rejects(readJsonResponse(new Response(null, { status: 304 })), { message: 'Request failed (304)' });
});

test('a missing response throws', async () => {
    await assert.rejects(readJsonResponse(undefined), { message: 'No response from the server' });
});

test('a 200 with a body that is not JSON throws', async () => {
    await assert.rejects(readJsonResponse(new Response('<html>login</html>', { status: 200 })), { message: 'Unexpected response from the server' });
});
