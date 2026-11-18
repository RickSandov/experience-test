import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeSegment, decodeSegment } from './segmentCodec.js';

const ROUND_TRIP = ['plain.csv', 'with space.csv', 'a%20b.csv', 'a~20b.csv', 'slash/inside', 'ñandú 100%.csv'];

test('every value survives encode, decodeURI (what history v4 does) and decode', () => {
    for (const value of ROUND_TRIP) {
        assert.equal(decodeSegment(decodeURI(encodeSegment(value))), value, value);
    }
});

test('encoded segments contain no percent sign and no slash', () => {
    for (const value of ROUND_TRIP) assert.doesNotMatch(encodeSegment(value), /[%/]/, value);
});

test('invalid hand-typed input is returned as is', () => {
    assert.equal(decodeSegment('~zz'), '~zz');
    assert.equal(decodeSegment(undefined), '');
});
