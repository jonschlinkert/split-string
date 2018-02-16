'use strict';

require('mocha');
var assert = require('assert');
var split = require('..');

describe('defaults', function() {
  it('should throw an error when arguments are invalid', function() {
    assert.throws(() => split(), /expected/);
  });

  it('should not split on escaped dots:', function() {
    assert.deepEqual(split('a.b.c\\.d'), ['a', 'b', 'c.d']);
  });

  it('should keep escaping when followed by a backslash:', function() {
    assert.deepEqual(split('a.b.c\\\\.d'), ['a', 'b', 'c\\\\', 'd']);
    assert.deepEqual(split('a.b.c\\\\d'), ['a', 'b', 'c\\\\d']);
  });

  it('should split a string on dots by default:', function() {
    assert.deepEqual(split('a.b.c'), ['a', 'b', 'c']);
  });

  it('should respect double-quoted strings', function() {
    assert.deepEqual(split('"b.c"'), ['b.c']);
    assert.deepEqual(split('a."b.c"'), ['a', 'b.c']);
    assert.deepEqual(split('a".b.c"'), ['a.b.c']);
    assert.deepEqual(split('a."b.c".d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a."b.c".d.".e.f.g.".h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect singlequoted strings', function() {
    assert.deepEqual(split('\'b.c\''), ['b.c']);
    assert.deepEqual(split('a.\'b.c\''), ['a', 'b.c']);
    assert.deepEqual(split('a.\'b.c\'.d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.\'b.c\'.d.\'.e.f.g.\'.h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect strings in backticks', function() {
    assert.deepEqual(split('`b.c`'), ['b.c']);
    assert.deepEqual(split('a.`b.c`'), ['a', 'b.c']);
    assert.deepEqual(split('a.`b.c`.d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.`b.c`.d.`.e.f.g.`.h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect strings in double smart-quotes: “”', function() {
    assert.deepEqual(split('“b.c”'), ['b.c']);
    assert.deepEqual(split('a.“b.c”'), ['a', 'b.c']);
    assert.deepEqual(split('a.“b.c”.d'), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.“b.c”.d.“.e.f.g.”.h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should retain unclosed double quotes in the results', function() {
    assert.deepEqual(split('a."b.c'), ['a', '"b', 'c']);
  });

  it('should retain unclosed single quotes in the results', function() {
    assert.deepEqual(split('brian\'s'), ['brian\'s']);
    assert.deepEqual(split('a.\'b.c'), ['a', '\'b', 'c']);
  });
});
