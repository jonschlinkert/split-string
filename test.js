'use strict';

require('mocha');
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

  it('should respect double-quoted strings', function () {
    assert.deepEqual(split('"b.c"'), ['b.c']);
    assert.deepEqual(split('a."b.c"'), ['a', 'b.c']);
    assert.deepEqual(split('a".b.c"'), ['a.b.c']);
    assert.deepEqual(split('a."b.c".d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a."b.c".d.".e.f.g.".h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect singlequoted strings', function () {
    assert.deepEqual(split('\'b.c\''), ['b.c']);
    assert.deepEqual(split('a.\'b.c\''), ['a', 'b.c']);
    assert.deepEqual(split('a.\'b.c\'.d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.\'b.c\'.d.\'.e.f.g.\'.h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should keep double quotes when options.keepDoubleQuotes is true', function () {
    assert.deepEqual(split('a."b.c".d', {keepDoubleQuotes: true}), ['a', '"b.c"', 'd']);
  });

  it('should keep single quotes when options.keepSingleQuotes is true', function () {
    assert.deepEqual(split('a.\'b.c\'.d', {keepSingleQuotes: true}), ['a', '\'b.c\'', 'd']);
  });

  it('should keep escaping when options.keepEscaping is true', function () {
    assert.deepEqual(split('a.b\\.c', {keepEscaping: true}), ['a', 'b\\.c']);
  });

  it('should not split on escaped dots:', function () {
    assert.deepEqual(split('a.b.c\\.d'), ['a', 'b', 'c.d']);
  });
});
