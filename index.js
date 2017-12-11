/*!
 * split-string <https://github.com/jonschlinkert/split-string>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');

module.exports = function(input, options, fn) {
  if (typeof input !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof options === 'function') {
    fn = options;
    options = null;
  }

  // allow separator to be defined as a string
  if (typeof options === 'string') {
    options = { separator: options };
  }

  var defaults = {
    separator: '.',
    doubleQuoteRegex: /^["“”]/,
    singleQuoteRegex: /^['‘’]/,
    quoteRegex: /^['‘’"“”`]/,
    quotes: {
      '"': '"',
      "'": "'",
      '`': '`',
      '‘': '’',
      '“': '”'
    }
  };

  var opts = extend({}, defaults, options);
  var sep = opts.sep || opts.separator;
  var quotes = opts.quotes;

  var brackets;
  if (opts.brackets === true) {
    brackets = {
      '<': '>',
      '(': ')',
      '[': ']',
      '{': '}'
    };
  } else if (opts.brackets) {
    brackets = opts.brackets;
  }

  var len = input.length;
  var index = -1;
  var closeIdx;
  var stack = [];
  var tokens = [''];
  var arr = [];

  function expected() {
    if (brackets && stack.length) {
      return brackets[stack[stack.length - 1]];
    }
  }

  while (++index < len) {
    var ch = input[index];
    var next = input[index + 1];
    var tok = { val: ch, index: index, tokens: tokens, input: input };
    arr.push(tok);

    if (ch === '\\') {
      tok.val = keepEscaping(opts, input, index) === true ? (ch + next) : next;
      tok.escaped = true;
      if (typeof fn === 'function') {
        fn(tok);
      }
      tokens[tokens.length - 1] += tok.val;
      index++;
      continue;
    }

    if (brackets && brackets[ch]) {
      stack.push(ch);
      var e = expected();
      var i = index + 1;

      if (input.indexOf(e, i + 1) !== -1) {
        while (stack.length && i < len) {
          var s = input[++i];
          if (s === '\\') {
            s++;
            continue;
          }

          if (quotes[s]) {
            i = getClosingQuote(input, quotes[s], i + 1);
            continue;
          }

          e = expected();
          if (stack.length && input.indexOf(e, i + 1) === -1) {
            break;
          }

          if (brackets[s]) {
            stack.push(s);
            continue;
          }

          if (e === s) {
            stack.pop();
          }
        }
      }

      closeIdx = i;
      if (closeIdx === -1) {
        tokens[tokens.length - 1] += ch;
        continue;
      }

      ch = input.slice(index, closeIdx + 1);
      tok.val = ch;
      tok.index = index = closeIdx;
    }

    if (quotes[ch]) {
      closeIdx = getClosingQuote(input, quotes[ch], index + 1);
      if (closeIdx === -1) {
        tokens[tokens.length - 1] += ch;
        continue;
      }

      if (keepQuotes(ch, opts) === true) {
        ch = input.slice(index, closeIdx + 1);
      } else {
        ch = input.slice(index + 1, closeIdx);
      }

      tok.val = ch;
      tok.index = index = closeIdx;
    }

    if (typeof fn === 'function') {
      fn(tok, arr);
      ch = tok.val;
      index = tok.index;
    }

    if (tok.val === sep && tok.split !== false) {
      tokens.push('');
      continue;
    }

    tokens[tokens.length - 1] += tok.val;
  }

  return tokens;
};

function getClosingQuote(str, ch, i, brackets) {
  var index = str.indexOf(ch, i);
  if (str.charAt(index - 1) === '\\') {
    return getClosingQuote(str, ch, index + 1);
  }
  return index;
}

function keepQuotes(ch, options) {
  if (options.keepDoubleQuotes === true && isDoubleQuote(ch, options)) return true;
  if (options.keepSingleQuotes === true && isSingleQuote(ch, options)) return true;
  return options.keepQuotes;
}

function keepEscaping(options, str, index) {
  if (typeof options.keepEscaping === 'function') {
    return options.keepEscaping(str, index);
  }
  return options.keepEscaping === true || str[index + 1] === '\\';
}

function isDoubleQuote(ch, options) {
  return options.doubleQuoteRegex.test(ch);
}

function isSingleQuote(ch, options) {
  return options.singleQuoteRegex.test(ch);
}
