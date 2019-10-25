'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('options.quotes', function() {
  let options = { quotes: ['"', "'", '`'] };

  it('should disable quotes support', () => {
    assert.deepEqual(split('a.\'b.c\'."d"', { quotes: [] }), ['a', "'b", "c'", '"d"']);
  });

  it('should keep single quotes', () => {
    let opts = { ...options, keep: val => val !== '"' };
    assert.deepEqual(split('a.\'b.c\'."d"', opts), ['a', "'b.c'", 'd']);
  });

  it('should keep "" double quotes', () => {
    let opts = { ...options, keep: () => true };
    assert.deepEqual(split('a."b.c".d', { quotes: true, keep: () => true }), ['a', '"b.c"', 'd']);
    assert.deepEqual(split('a."b.c".d', options), ['a', '"b.c"', 'd']);
    assert.deepEqual(split('a."b.c".d', options), ['a', '"b.c"', 'd']);
  });

  it('should keep “” smart quotes', () => {
    let opts = { brackets: { '“': '”' }, keep: () => true };
    assert.deepEqual(split('a.“b.c”.d', opts), ['a', '“b.c”', 'd']);
  });

  it('should keep backticks', () => {
    let opts = { ...options, keep: () => true };
    assert.deepEqual(split('a.`b.c`.d', opts), ['a', '`b.c`', 'd']);
  });

  it('should support custom brackets', () => {
    let keep = val => !/^[~$^“”]$/.test(val);
    let opts = { brackets: { '^': '$', '“': '”' }, keep }
    assert.deepEqual(split('a.^b.c$', opts), ['a', 'b.c']);
    assert.deepEqual(split('“b.c”', opts), ['b.c']);
    assert.deepEqual(split('a.“b.c”', opts), ['a', 'b.c']);
    assert.deepEqual(split('a.“b.c”.d', opts), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.“b.c”.d.“.e.f.g.”.h', opts), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should support custom quotes', () => {
    let keep = val => val !== '^' && val !== '~';
    assert.deepEqual(split('a.^b.c^', { quotes: ['^'], keep }), ['a', 'b.c']);
    assert.deepEqual(split('a.~b.c~', { quotes: ['~'], keep }), ['a', 'b.c']);
  });

  it('should support double-quoted strings', function() {
    let keep = val => val !== '"';
    let opts = { ...options, keep };
    assert.deepEqual(split('"b.c"', opts), ['b.c']);
    assert.deepEqual(split('a."b.c"', opts), ['a', 'b.c']);
    assert.deepEqual(split('a".b.c"', opts), ['a.b.c']);
    assert.deepEqual(split('a."b.c".d', opts), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a."b.c".d.".e.f.g.".h', opts), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect single-quoted strings', function() {
    let keep = val => val !== '\'';
    let opts = { ...options, keep };
    assert.deepEqual(split("'b.c'", opts), ['b.c']);
    assert.deepEqual(split("a.'b.c'", opts), ['a', 'b.c']);
    assert.deepEqual(split("a.'b.c'.d", opts), ['a', 'b.c', 'd']);
    assert.deepEqual(split("a.'b.c'.d.'.e.f.g.'.h", opts), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should respect strings in backticks', function() {
    let keep = val => val !== '`';
    let opts = { ...options, keep };
    assert.deepEqual(split('`b.c`', opts), ['b.c']);
    assert.deepEqual(split('a.`b.c`', opts), ['a', 'b.c']);
    assert.deepEqual(split('a.`b.c`.d', opts), ['a', 'b.c', 'd']);
    assert.deepEqual(split('a.`b.c`.d.`.e.f.g.`.h', opts), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
  });

  it('should retain unclosed double quotes in the results', function() {
    assert.deepEqual(split('a."b.c'), ['a', '"b', 'c']);
  });

  it('should retain unclosed single quotes in the results', function() {
    assert.deepEqual(split("brian's"), ["brian's"]);
    assert.deepEqual(split("a.'b.c"), ['a', "'b", 'c']);
  });

  it('should ignore escaped escape chars before quote', function() {
    assert.deepEqual(split('\\\\\\\\"hello.world\\\\\\\\"', options), ['\\\\\\\\"hello.world\\\\\\\\"']);
  });
});
