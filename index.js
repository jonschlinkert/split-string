/*!
 * split-string <https://github.com/jonschlinkert/split-string>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var nonchar = require('noncharacters');

function split(str, ch) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string.');
  }
  ch = ch || '.';
  var esc = str.split('\\' + ch).join(nonchar);
  var segs = esc.split(ch);
  var len = segs.length, i = -1;
  var res = [];
  while (++i < len) {
    res.push(segs[i].split(nonchar).join(ch));
  }
  return res;
}

/**
 * expose `split`
 */

module.exports = split;
