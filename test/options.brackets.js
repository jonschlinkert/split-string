'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('options.brackets', () => {
  it('should throw when brackets are unclosed', () => {
    assert.throws(() => split('a.{a.{b.c.}.c', { brackets: true, strict: true }), /Unmatched/);
  });

  it('should not split inside brackets', () => {
    let opts = { brackets: true };
    assert.deepEqual(split('a.(b.c).d', opts), ['a', '(b.c)', 'd']);
    assert.deepEqual(split('a.[(b.c)].d', opts), ['a', '[(b.c)]', 'd']);
    assert.deepEqual(split('a.[b.c].d', opts), ['a', '[b.c]', 'd']);
    assert.deepEqual(split('a.{b.c}.d', opts), ['a', '{b.c}', 'd']);
    assert.deepEqual(split('a.<b.c>.d', opts), ['a', '<b.c>', 'd']);
  });

  it('should support nested brackets', () => {
    let opts = { brackets: true };
    assert.deepEqual(split('a.{b.{c}.d}.e', opts), ['a', '{b.{c}.d}', 'e']);
    assert.deepEqual(split('a.{b.{c.d}.e}.f', opts), ['a', '{b.{c.d}.e}', 'f']);
    assert.deepEqual(split('a.{[b.{{c.d}}.e]}.f', opts), ['a', '{[b.{{c.d}}.e]}', 'f']);
  });

  it('should support escaped brackets', () => {
    let opts = { brackets: true };
    assert.deepEqual(split('a.\\{b.{c.c}.d}.e', opts), ['a', '{b', '{c.c}', 'd}', 'e']);
    assert.deepEqual(split('a.{b.c}.\\{d.e}.f', opts), ['a', '{b.c}', '{d', 'e}', 'f']);
  });

  it('should support quoted brackets', () => {
    let opts = { brackets: true };
    assert.deepEqual(split('a.{b.c}."{d.e}".f', opts), ['a', '{b.c}', '"{d.e}"', 'f']);
    assert.deepEqual(split('a.{b.c}.{"d.e"}.f', opts), ['a', '{b.c}', '{"d.e"}', 'f']);
  });

  it('should ignore imbalanced brackets', () => {
    let opts = { brackets: true };
    assert.deepEqual(split('a.{b.c}.{d.e', opts), ['a', '{b.c}', '{d', 'e']);
    assert.deepEqual(split('a.{b.c.{e.f}}.{g', opts), ['a', '{b.c.{e.f}}', '{g']);
    assert.deepEqual(split('a.{b.c', opts), ['a', '{b', 'c']);
    assert.deepEqual(split('a.{a.{b.c}.d', opts), ['a', '{a', '{b', 'c}', 'd']);
    assert.deepEqual(split('a.{a.{b.c.d', opts), ['a', '{a', '{b', 'c', 'd']);
  });

  it('should take more separators in array with more characters as custom separator and prevent brackets', () => {
    const opts = { brackets: true, separator: ['||', '&&'] };
    assert.deepEqual(split('a&&[b&&d]&&c', opts), ['a', '[b&&d]', 'c']);
    assert.deepEqual(split('a||[b&&d]&&c', opts), ['a', '[b&&d]', 'c']);
    assert.deepEqual(split('a||[b||d]&&c', opts), ['a', '[b||d]', 'c']);
    assert.deepEqual(split('[a&&a]&&[b||c]', opts), ['[a&&a]', '[b||c]']);
  });
});
