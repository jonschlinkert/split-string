'use strict';

require('mocha');
var assert = require('assert');
var split = require('..');

describe('options', function() {
  describe('separator', function() {
    it('should split on a custom separator', function() {
      assert.deepEqual(split('a/b/c', {separator: '/'}), ['a', 'b', 'c']);
      assert.deepEqual(split('a,b,c', {separator: ','}), ['a', 'b', 'c']);
    });

    it('should not split on an escaped custom separator:', function() {
      assert.deepEqual(split('a/b/c\\/d', {separator: '/'}), ['a', 'b', 'c/d']);
    });

    it('should take a custom function for splitting', function() {
      const stash = split('a.b.c', function(token) {
        const prev = this.prev();
        if (prev && prev.value === 'a') {
          token.split = () => false;
        }
      });
      assert.deepEqual(stash, ['a.b', 'c']);
    });

    it('should take a custom options.split function for splitting', function() {
      const stash = split('a.b.c', {
        split: function(token) {
          const prev = this.prev();
          if (prev && prev.value === 'a') {
            return false;
          }
          return true;
        }
      });
      assert.deepEqual(stash, ['a.b', 'c']);
    });
  });

  describe('quotes', function() {
    it('should disable quotes support', function() {
      assert.deepEqual(split('a.\'b.c\'."d"', {quotes: false}), ['a', '\'b', 'c\'', '"d"']);
    });

    it('should keep single quotes', function() {
      assert.deepEqual(split('a.\'b.c\'."d"', {keepSingleQuotes: true}), ['a', '\'b.c\'', 'd']);
      assert.deepEqual(split('a.\'b.c\'."d"', {keepQuotes: true}), ['a', '\'b.c\'', '"d"']);
    });

    it('should keep double quotes', function() {
      assert.deepEqual(split('a."b.c".d', {keepDoubleQuotes: true}), ['a', '"b.c"', 'd']);
      assert.deepEqual(split('a."b.c".d', {keepQuotes: true}), ['a', '"b.c"', 'd']);
    });

    it('should keep “” double quotes', function() {
      assert.deepEqual(split('a.“b.c”.d', {keepSmartQuotes: true}), ['a', '“b.c”', 'd']);
      assert.deepEqual(split('a.“b.c”.d', {keepQuotes: true}), ['a', '“b.c”', 'd']);
    });

    it('should keep backticks', function() {
      assert.deepEqual(split('a.`b.c`.d', {keepBackticks: true}), ['a', '`b.c`', 'd']);
      assert.deepEqual(split('a.`b.c`.d', {keepQuotes: true}), ['a', '`b.c`', 'd']);
    });

    it('should allow custom quotes object', function() {
      assert.deepEqual(split('a.^b.c$', {quotes: {'^': '$'}}), ['a', 'b.c']);
      assert.deepEqual(split('a.^b.c^', {quotes: {'^': '^'}}), ['a', 'b.c']);
      assert.deepEqual(split('a.~b.c~', {quotes: {'~': '~'}}), ['a', 'b.c']);
    });
  });

  describe('keepEscaping', function() {
    it('should keep escape characters', function() {
      assert.deepEqual(split('a.b\\.c', {keepEscaping: true}), ['a', 'b\\.c']);
    });
  });

  describe('brackets', function() {
    it('should throw when brackets are unclosed', function() {
      assert.throws(function() {
        split('a.{a.{b.c.}.c', {brackets: true, strict: true});
      }, /unclosed/);
    });

    it('should not split inside brackets', function() {
      var opts = { brackets: true };
      assert.deepEqual(split('a.(b.c).d', opts), ['a', '(b.c)', 'd']);
      assert.deepEqual(split('a.[(b.c)].d', opts), ['a', '[(b.c)]', 'd']);
      assert.deepEqual(split('a.[b.c].d', opts), ['a', '[b.c]', 'd']);
      assert.deepEqual(split('a.{b.c}.d', opts), ['a', '{b.c}', 'd']);
      assert.deepEqual(split('a.<b.c>.d', opts), ['a', '<b.c>', 'd']);
    });

    it('should support nested brackets', function() {
      var opts = { brackets: true };
      assert.deepEqual(split('a.{b.{c}.d}.e', opts), ['a', '{b.{c}.d}', 'e']);
      assert.deepEqual(split('a.{b.{c.d}.e}.f', opts), ['a', '{b.{c.d}.e}', 'f']);
      assert.deepEqual(split('a.{[b.{{c.d}}.e]}.f', opts), ['a', '{[b.{{c.d}}.e]}', 'f']);
    });

    it('should support escaped brackets', function() {
      var opts = { brackets: true };
      assert.deepEqual(split('a.\\{b.{c.c}.d}.e', opts), ['a', '{b', '{c.c}', 'd}', 'e']);
      assert.deepEqual(split('a.{b.c}.\\{d.e}.f', opts), ['a', '{b.c}', '{d', 'e}', 'f']);
    });

    it('should support quoted brackets', function() {
      var opts = { brackets: true };
      assert.deepEqual(split('a.{b.c}."{d.e}".f', opts), ['a', '{b.c}', '{d.e}', 'f']);
      assert.deepEqual(split('a.{b.c}.{"d.e"}.f', opts), ['a', '{b.c}', '{"d.e"}', 'f']);
    });

    it('should ignore imbalanced brackets', function() {
      var opts = { brackets: true };
      assert.deepEqual(split('a.{b.c', opts), ['a', '{b', 'c']);
      assert.deepEqual(split('a.{a.{b.c}.d', opts), ['a', '{a', '{b', 'c}', 'd']);
    });
  });
});
