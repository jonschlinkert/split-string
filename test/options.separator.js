'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('separator', () => {
  it('should split on a custom separator', () => {
    assert.deepEqual(split(',,,', { separator: ',' }), ['', '', '', '']);
    assert.deepEqual(split('||||', { separator: '|' }), ['', '', '', '', '']);
    assert.deepEqual(split('||||', { separator: ',' }), ['||||']);
    assert.deepEqual(split('|,|,|,|', { separator: ',' }), ['|', '|', '|', '|']);
    assert.deepEqual(split('a/b/c', { separator: '/' }), ['a', 'b', 'c']);
    assert.deepEqual(split('a,b,c', { separator: ',' }), ['a', 'b', 'c']);
  });

  it('should not split on an escaped custom separator:', () => {
    assert.deepEqual(split('a/b/c\\/d', { separator: '/' }), ['a', 'b', 'c/d']);
  });

  it('should take a custom function for splitting', () => {
    assert.deepEqual(split('.a.b.c', state => !state.bos()), ['.a', 'b', 'c']);
    assert.deepEqual(split('a.b.c', state => state.prev() !== 'a'), ['a.b', 'c']);
    assert.deepEqual(split('a.b.c', state => state.next() !== 'b'), ['a.b', 'c']);
    assert.deepEqual(split('a.b.c', state => state.next() !== 'c'), ['a', 'b.c']);
  });
});

