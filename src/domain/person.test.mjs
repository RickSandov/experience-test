import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPersonFound, personHeading } from './person.js';

test('a response with a first or last name is a found person', () => {
    assert.equal(isPersonFound({ firstName: 'Ricardo Javier', lastName: 'Sandoval' }), true);
    assert.equal(isPersonFound({ lastName: 'Sandoval' }), true);
});

test('an empty object, an empty body or blank names mean not found', () => {
    assert.equal(isPersonFound({}), false);
    assert.equal(isPersonFound(null), false);
    assert.equal(isPersonFound(''), false);
    assert.equal(isPersonFound({ firstName: ' ', lastName: '' }), false);
});

test('the heading reads "bannerId - lastName, firstName"', () => {
    assert.equal(
        personHeading('12636344', { firstName: 'Ricardo Javier', lastName: 'Sandoval' }),
        '12636344 - Sandoval, Ricardo Javier'
    );
});

test('a missing name part drops its comma', () => {
    assert.equal(personHeading('12636344', { lastName: 'Sandoval' }), '12636344 - Sandoval');
    assert.equal(personHeading('12636344', { firstName: 'Ricardo' }), '12636344 - Ricardo');
});
