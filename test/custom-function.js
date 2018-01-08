'use strict';

require('mocha');
const assert = require('assert');
const split = require('..');

describe('function', function() {
  it('should call a custom function on every token', function() {
    function fn(tok) {
      if (tok.escaped && tok.value === 'b') {
        tok.value = '\\b';
        return;
      }

      if (!/[@!*+]/.test(tok.value)) return;
      const stack = [];
      const str = this.string;
      let i = -1;

      while (++i < str.length) {
        const ch = str[i];
        if (ch === '(') {
          stack.push(ch);
        }

        if (ch === ')') {
          stack.pop();
          if (!stack.length) {
            this.consume(1);
            tok.value += ch;
            break;
          }
        }
        this.consume(1);
        tok.value += ch;
      }
    }

    const opts = { separator: ',', brackets: false };
    assert.deepEqual(split('a.@(b,c)', fn), ['a', '@(b,c)']);
    assert.deepEqual(split('a,@(b,c)', opts, fn), ['a', '@(b,c)']);
    assert.deepEqual(split('a,(\\b,c)', opts, fn), ['a', '(\\b', 'c)']);
    assert.deepEqual(split('a,(b,c)', opts, fn), ['a', '(b', 'c)']);
    assert.deepEqual(split('a,@(b,(c,d)e)', opts, fn), ['a', '@(b,(c,d)e)']);
    assert.deepEqual(split('a,@(b,(c,d)e)z', opts, fn), ['a', '@(b,(c,d)e)z']);
    assert.deepEqual(split('a,@(b,(a,b)c),z', opts, fn), ['a', '@(b,(a,b)c)', 'z']);
    assert.deepEqual(split('a,+(b,c)', opts, fn), ['a', '+(b,c)']);
    assert.deepEqual(split('a,*(b|c,d)', opts, fn), ['a', '*(b|c,d)']);
  });
});
