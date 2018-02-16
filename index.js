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

  /**
   * Setup brackets and quotes characters and regex based on options
   */

  const brackets = opts.brackets === true ? defaults.brackets : opts.brackets;
  const quotes = opts.quotes === true || typeof opts.quotes === 'undefined'
    ? defaults.quotes
    : opts.quotes;

  // brackets
  const openChars = brackets ? Object.keys(brackets) : [];
  const closeChars = brackets ? values(brackets) : [];
  const openStr = brackets ? escape(openChars) : '';
  const closeStr = brackets ? escape(closeChars) : '';

  // quotes
  const quoteChars = union(Object.keys(quotes), values(quotes));
  const quoteStr = quotes ? escape(quoteChars) : '';

  // regex for "text" handler
  const textRegex = new RegExp('^[^\\\\' + sep + openStr + closeStr + quoteStr + ']+');

  /**
   * Listener
   */

  lexer.on('token', token => fn && fn.call(lexer, token));
  lexer.split = function(token) {
    if (typeof token.split === 'function') {
      return token.split.call(this);
    }
    if (typeof this.options.split === 'function') {
      return this.options.split.call(this, token);
    }
    return true;
  };

  /**
   * Handlers
   */

  lexer.capture('escape', /^\\(.)/, function(token) {
    const keep = token.keepEscaping === true || opts.keepEscaping === true;
    if (keep === false && token.value !== '\\\\') {
      token.value = token.value.slice(1);
    }
    return token;
  });

  lexer.capture('separator', toRegex(escape(sep.split(''))), function(token) {
    if (this.split(token) === false || this.isInside('quote') || this.isInside('bracket')) {
      return token;
    }

    const prev = this.prev();
    if (prev && prev.type === 'separator') {
      this.stash.push('');
    }

    token.value = '';
    if (!this.stack.length && this.stash.last() !== '') {
      this.stash.push(token.value);
    }
    return token;
  });

  lexer.capture('text', textRegex);

  if (quotes) {
    lexer.capture('quote', toRegex(quoteStr), function(token) {
      if (this.isInside('bracket')) return token;

      const val = token.match[0];
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
        token.queue = [];
        token.isClose = value => value === quotes[val];
        this.stack.push(token);
      }
      return token;
    });
  }

  if (brackets) {
    lexer.capture('bracket', toRegex(openStr), function(token) {
      token.append = false;
      token.queue = [];
      token.isClose = value => value === brackets[token.value];
      this.stack.push(token);
      return token;
    });
    lexer.capture('bracket.close', toRegex(closeStr), function(token) {
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
    const open = this.stack.last();
    if (open && typeof open.isClose === 'function') {
      return open.isClose(ch);
    }
  };

  lexer.append = function(val) {
    if (!val) return;
    const last = this.stack.last();
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
        const segs = token.queue.join('').split(sep);
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

function toRegex(str) {
  return new RegExp('^(?=.)[' + str + ']');
}

function escape(arr) {
  return '\\' + arr.join('\\');
}

function values(obj) {
  const arr = [];
  for (const key of Object.keys(obj)) arr.push(obj[key]);
  return arr;
}

function keepQuotes(ch, opts) {
  if (opts.keepQuotes === true) return true;
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
  return false;
}
