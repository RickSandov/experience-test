import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBannerIdInput, isValidBannerId } from './bannerId.js';

test('typing keeps digits only', () => {
    assert.equal(normalizeBannerIdInput(' 12a6-36 '), '12636');
});

test('typing stops at 8 digits', () => {
    assert.equal(normalizeBannerIdInput('1263634499'), '12636344');
});

test('a missing value normalizes to an empty string', () => {
    assert.equal(normalizeBannerIdInput(undefined), '');
    assert.equal(normalizeBannerIdInput(null), '');
});

test('exactly 8 digits is a valid Banner ID', () => {
    assert.equal(isValidBannerId('12636344'), true);
});

test('7 or 9 digits, letters or a non-string are not valid', () => {
    assert.equal(isValidBannerId('1263634'), false);
    assert.equal(isValidBannerId('126363441'), false);
    assert.equal(isValidBannerId('1263634a'), false);
    assert.equal(isValidBannerId(12636344), false);
});
