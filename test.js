'use strict';

/* deps: mocha */
var assert = require('assert');
var split = require('./');

describe('split', function () {
  it('should split a string on the given character:', function () {
    assert.deepEqual(split('a/b/c', '/'), ['a', 'b', 'c']);
  });

  it('should not split on an escaped character:', function () {
    assert.deepEqual(split('a/b/c\\/d', '/'), ['a', 'b', 'c/d']);
  });

  it('should split a string on dots by default:', function () {
    assert.deepEqual(split('a.b.c'), ['a', 'b', 'c']);
  });

  it('should not split on escaped dots:', function () {
    assert.deepEqual(split('a.b.c\\.d'), ['a', 'b', 'c.d']);
  });
});
