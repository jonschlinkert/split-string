'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('keep', () => {
  it('should keep all characters', () => {
    assert.deepEqual(split('a.b\\.c', { keep: () => true }), ['a', 'b\\.c']);
  });

  it('should not keep backslashes', () => {
    assert.deepEqual(split('a.b\\.c', { keep: val => val !== '\\' }), ['a', 'b.c']);
  });

  it('should not keep quotes', () => {
    assert.deepEqual(split('"a.b".c', { quotes: ['"'], keep: val => val !== '"' }), ['a.b', 'c']);
  });
});
