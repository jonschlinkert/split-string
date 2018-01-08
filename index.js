/*!
 * split-string <https://github.com/jonschlinkert/split-string>
 *
 * Copyright (c) 2015-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const Lexer = require('snapdragon-lexer');
const union = require('arr-union');
const defaults = {
  brackets: { '<': '>', '(': ')', '[': ']', '{': '}' },
  quotes: { '"': '"', "'": "'", '`': '`', '“': '”' }
};

module.exports = function(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof options === 'function') {
    fn = options;
    options = null;
  }

  const opts = Object.assign({ separator: '.' }, options);
  const sep = opts.sep || opts.separator;
  const lexer = new Lexer(str, opts);
  lexer.split = (token) => {
    if (typeof lexer.options.split === 'function') {
      return lexer.options.split.call(lexer, token);
    }
    return true;
  };

  // brackets support
  const brackets = opts.brackets === true ? defaults.brackets : opts.brackets;

  // quotes support
  const quotes = opts.quotes === true || typeof opts.quotes === 'undefined'
    ? defaults.quotes
    : opts.quotes;

  const openChars = brackets ? Object.keys(brackets) : [];
  const closeChars = brackets ? Object.values(brackets) : [];
  const quoteChars = union(Object.keys(quotes), Object.values(quotes));
  const openStr = brackets ? escape(openChars) : '';
  const closeStr = brackets ? escape(closeChars) : '';
  const quoteStr = quotes ? escape(quoteChars) : '';
  const textRegexp = new RegExp(`^[^\\\\${sep + openStr + closeStr + quoteStr}]+`);

  /**
   * Handlers
   */

  lexer.capture('escape', /^\\(.)/, function(token) {
    token.escaped = true;
    if (opts.keepEscaping !== true && token.value !== '\\\\') {
      token.value = token.value.slice(1);
    }
    if (fn) fn.call(this, token);
    return token;
  });

  lexer.capture('separator', toRegexp(escape(sep.split(''))), function(token) {
    if (fn) fn.call(this, token);

    if (typeof token.split === 'function' && token.split() === false) {
      return token;
    }
    if (lexer.split(token) === false) {
      return token;
    }

    if (!this.stack.length && this.last(this.stash) !== '') {
      this.stash.push('');
    }
    if (!this.isInside('quote') && !this.isInside('bracket')) {
      token.value = '';
    }
    return token;
  });

  lexer.capture('text', textRegexp, (token) => {
    if (fn) fn.call(lexer, token);
    return token;
  });

  if (quotes) {
    lexer.capture('quote', toRegexp(quoteStr), function(token) {
      if (this.isInside('bracket')) return token;

      let val = token.match[0];
      token.append = false;

      if (!keepQuotes(val, opts)) {
        token.value = '';
      }

      if (this.isClose(val)) {
        const open = this.stack.pop();
        open.closed = true;
        this.unwind(open, true);
        this.append(token.value);

      } else {
        token.isClose = value => value === quotes[val];
        token.queue = [];
        this.stack.push(token);
      }
      return token;
    });
  }

  if (brackets) {
    lexer.capture('bracket', toRegexp(openStr), function(token) {
      token.isClose = value => value === brackets[token.value];
      token.append = false;
      token.queue = [];
      this.stack.push(token);
      return token;
    });
    lexer.capture('bracket.close', toRegexp(closeStr), function(token) {
      if (this.isClose(token.value)) {
        const open = this.stack.pop();
        open.value += open.queue.join('');
        this.append(open.value);
      }
      return token;
    });
  }

  /**
   * Custom lexer methods
   */

  lexer.isClose = function(ch) {
    const open = this.stack.last;
    if (open && typeof open.isClose === 'function') {
      return open.isClose(ch);
    }
  };

  lexer.append = function(val) {
    if (!val) return;
    const last = this.stack.last;
    if (last && Array.isArray(last.queue)) {
      last.queue.push(val);
    } else {
      this.stash[this.stash.length - 1] += val;
    }
  };

  // add queued strings back to the stash
  lexer.unwind = function(token, append) {
    switch (token && token.type) {
      case 'bracket':
        const segs = token.queue.join('').split('.');
        this.append(token.value);
        this.append(segs.shift());
        this.stash = this.stash.concat(segs);
        break;
      case 'quote':
        const quote = token.closed && !keepQuotes(token.match[0], opts) ? '' : token.match[0];
        this.append(quote);
        this.append(token.queue.shift());

        while (token.queue.length) {
          const val = token.queue.shift();
          if (append) {
            this.append(val);
            continue;
          }

          if (val !== sep) {
            this.stash.push(val);
          }
        }
        break;
      default: {
        break;
      }
    }
  };

  // start tokenizing
  lexer.tokenize(str);

  // ensure the stack is empty
  if (lexer.options.strict === true) {
    lexer.fail();
  }

  lexer.unwind(lexer.stack.pop());
  lexer.fail();
  return lexer.stash;
};

function toRegexp(str) {
  return new RegExp(`^(?=.)[${str}]`);
}

function escape(arr) {
  return '\\' + arr.join('\\');
}

function keepQuotes(ch, opts) {
  if (opts.keepSmartQuotes === true && (ch === '“' || ch === '”')) {
    return true;
  }
  if (opts.keepDoubleQuotes === true && ch === '"') {
    return true;
  }
  if (opts.keepSingleQuotes === true && ch === '\'') {
    return true;
  }
  if (opts.keepBackticks === true && ch === '`') {
    return true;
  }
  return opts.keepQuotes;
}
