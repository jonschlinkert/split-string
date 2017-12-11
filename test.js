'use strict';

require('mocha');
var assert = require('assert');
var split = require('./');

describe('split-string', function() {
  describe('split-string', function() {
    it('should split a string on the given character:', function() {
      assert.deepEqual(split('a/b/c', '/'), ['a', 'b', 'c']);
    });

    it('should not split on an escaped character:', function() {
      assert.deepEqual(split('a/b/c\\/d', '/'), ['a', 'b', 'c/d']);
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

    it('should respect strings in “” double quotes', function() {
      assert.deepEqual(split('“b.c”'), ['b.c']);
      assert.deepEqual(split('a.“b.c”'), ['a', 'b.c']);
      assert.deepEqual(split('a.“b.c”.d'), ['a', 'b.c', 'd']);
      assert.deepEqual(split('a.“b.c”.d.“.e.f.g.”.h'), ['a', 'b.c', 'd', '.e.f.g.', 'h']);
    });

    it('should not split on escaped dots:', function() {
      assert.deepEqual(split('a.b.c\\.d'), ['a', 'b', 'c.d']);
    });

    it('should keep escaping when followed by a backslash:', function() {
      assert.deepEqual(split('a.b.c\\\\.d'), ['a', 'b', 'c\\\\', 'd']);
      assert.deepEqual(split('a.b.c\\\\d'), ['a', 'b', 'c\\\\d']);
    });

    it('should retain unclosed double quotes in the results', function() {
      assert.deepEqual(split('a."b.c'), ['a', '"b', 'c']);
    });

    it('should retain unclosed single quotes in the results', function() {
      assert.deepEqual(split('brian\'s'), ['brian\'s']);
      assert.deepEqual(split('a.\'b.c'), ['a', '\'b', 'c']);
    });
  });

  describe('options', function() {
    it('should keep double quotes', function() {
      assert.deepEqual(split('a."b.c".d', {keepDoubleQuotes: true}), ['a', '"b.c"', 'd']);
    });

    it('should keep “” double quotes', function() {
      assert.deepEqual(split('a.“b.c”.d', {keepDoubleQuotes: true}), ['a', '“b.c”', 'd']);
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
      assert.deepEqual(split('a.{a.{b.c}.d', opts), ['a', '{a.{b.c}', 'd']);
    });

    it('should keep single quotes', function() {
      assert.deepEqual(split('a.\'b.c\'.d', {keepSingleQuotes: true}), ['a', '\'b.c\'', 'd']);
    });

    it('should keep escape characters', function() {
      assert.deepEqual(split('a.b\\.c', {keepEscaping: true}), ['a', 'b\\.c']);
    });

    it('should split on a custom separator', function() {
      assert.deepEqual(split('a,b,c', {sep: ','}), ['a', 'b', 'c']);
    });

    it('should allow custom quotes object', function() {
      assert.deepEqual(split('a.^b.c$', {quotes: {'^': '$'}}), ['a', 'b.c']);
    });
  });

  describe('function', function() {
    it('should call a custom function on every token', function() {
      function fn(tok, tokens) {
        if (tok.escaped && tok.val === 'b') {
          tok.val = '\\b';
          return;
        }

        if (!/[@!*+]/.test(tok.val)) return;
        var stack = [];
        var val = tok.val;
        var str = tok.input;
        var i = tok.index;

        while (++i < str.length) {
          var ch = str[i];
          if (ch === '(') {
            stack.push(ch);
          }

          if (ch === ')') {
            stack.pop();
            if (!stack.length) {
              val += ch;
              break;
            }
          }
          val += ch;
        }

        tok.split = false;
        tok.index = i;
        tok.val = val;
      }

      var opts = {sep: ',', brackets: null};
      assert.deepEqual(split('a,(\\b,c)', opts, fn), ['a', '(\\b', 'c)']);
      assert.deepEqual(split('a,(b,c)', opts, fn), ['a', '(b', 'c)']);
      assert.deepEqual(split('a,@(b,c)', opts, fn), ['a', '@(b,c)']);
      assert.deepEqual(split('a,@(b,(a,b)c)', opts, fn), ['a', '@(b,(a,b)c)']);
      assert.deepEqual(split('a,@(b,(a,b)c),z', opts, fn), ['a', '@(b,(a,b)c)', 'z']);
      assert.deepEqual(split('a,+(b,c)', opts, fn), ['a', '+(b,c)']);
      assert.deepEqual(split('a,*(b|c,d)', opts, fn), ['a', '*(b|c,d)']);
    });
  });
});
