'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('defaults', () => {
  it('should throw an error when arguments are invalid', () => {
    assert.throws(() => split(), /expected/);
  });

  it('should not split on escaped dots:', () => {
    assert.deepEqual(split('a.b.c\\.d'), ['a', 'b', 'c.d']);
  });

  it('should keep escaping when followed by a backslash:', () => {
    assert.deepEqual(split('a.b.c\\\\.d'), ['a', 'b', 'c\\\\', 'd']);
    assert.deepEqual(split('a.b.c\\\\d'), ['a', 'b', 'c\\\\d']);
  });

  it('should split a string on dots by default:', () => {
    assert.deepEqual(split('a.b.c'), ['a', 'b', 'c']);
  });
});
