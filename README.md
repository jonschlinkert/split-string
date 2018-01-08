# split-string [![NPM version](https://img.shields.io/npm/v/split-string.svg?style=flat)](https://www.npmjs.com/package/split-string) [![NPM monthly downloads](https://img.shields.io/npm/dm/split-string.svg?style=flat)](https://npmjs.org/package/split-string) [![NPM total downloads](https://img.shields.io/npm/dt/split-string.svg?style=flat)](https://npmjs.org/package/split-string) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/split-string.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/split-string)

> Split a string on a character except when the character is escaped.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save split-string
```

<!-- section: Why use this? -->

<details>
<summary><strong>Why use this?</strong></summary>

<br>

Although it's easy to split on a string:

```js
console.log('a.b.c'.split('.'));
//=> ['a', 'b', 'c']
```

It's more challenging to split a string whilst respecting escaped or quoted characters.

**This is bad**

```js
console.log('a\\.b.c'.split('.'));
//=> ['a\\', 'b', 'c']

console.log('"a.b.c".d'.split('.'));
//=> ['"a', 'b', 'c"', 'd']
```

**This is good**

```js
var split = require('split-string');
console.log(split('a\\.b.c'));
//=> ['a.b', 'c']

console.log(split('"a.b.c".d'));
//=> ['a.b.c', 'd']
```

See the [options](#options) to learn how to choose the separator or retain quotes or escaping.

<br>

</details>

## Usage

```js
var split = require('split-string');

split('a.b.c');
//=> ['a', 'b', 'c']

// respects escaped characters
split('a.b.c\\.d');
//=> ['a', 'b', 'c.d']

// respects double-quoted strings
split('a."b.c.d".e');
//=> ['a', 'b.c.d', 'e']
```

**Brackets**

Also respects brackets [unless disabled](#optionsbrackets):

```js
split('a (b c d) e', ' ');
//=> ['a', '(b c d)', 'e']
```

## Options

### options.brackets

**Type**: `object|boolean`

**Default**: `undefined`

**Description**

If enabled, split-string will not split inside brackets. The following brackets types are supported when `options.brackets` is `true`,

```js
{
  '<': '>',
  '(': ')',
  '[': ']',
  '{': '}'
}
```

Or, if object of brackets must be passed, each property on the object must be a bracket type, where the property key is the opening delimiter and property value is the closing delimiter.

**Examples**

```js
// no bracket support by default
split('a.{b.c}');
//=> [ 'a', '{b', 'c}' ]

// support all basic bracket types: "<>{}[]()"
split('a.{b.c}', {brackets: true});
//=> [ 'a', '{b.c}' ]

// also supports nested brackets 
split('a.{b.{c.d}.e}.f', {brackets: true});
//=> [ 'a', '{b.{c.d}.e}', 'f' ]

// support only the specified bracket types
split('«a.b».⟨c.d⟩', {brackets: {'«': '»', '⟨': '⟩'}});
//=> [ '«a.b»', '⟨c.d⟩' ]
split('a.{a.[{b.c}].d}.e', {brackets: {'[': ']'}});
//=> [ 'a', '{a', '[{b.c}]', 'd}', 'e' ]
```

### options.keepEscaping

**Type**: `boolean`

**Default**: `undefined`

Keep backslashes in the result.

**Example**

```js
split('a.b\\.c');
//=> ['a', 'b.c']

split('a.b.\\c', {keepEscaping: true});
//=> ['a', 'b\.c']
```

### options.keepQuotes

**Type**: `boolean`

**Default**: `undefined`

Keep single- or double-quotes in the result.

**Example**

```js
split('a."b.c.d".e');
//=> ['a', 'b.c.d', 'e']

split('a."b.c.d".e', {keepQuotes: true});
//=> ['a', '"b.c.d"', 'e']

split('a.\'b.c.d\'.e', {keepQuotes: true});
//=> ['a', '\'b.c.d\'', 'e']
```

### options.keepDoubleQuotes

**Type**: `boolean`

**Default**: `undefined`

Keep double-quotes in the result.

**Example**

```js
split('a."b.c.d".e');
//=> ['a', 'b.c.d', 'e']

split('a."b.c.d".e', {keepDoubleQuotes: true});
//=> ['a', '"b.c.d"', 'e']
```

### options.keepSingleQuotes

**Type**: `boolean`

**Default**: `undefined`

Keep single-quotes in the result.

**Example**

```js
split('a.\'b.c.d\'.e');
//=> ['a', 'b.c.d', 'e']

split('a.\'b.c.d\'.e', {keepSingleQuotes: true});
//=> ['a', '\'b.c.d\'', 'e']
```

### options.separator

**Type**: `string`

**Default**: `.`

The separator/character to split on. Aliased as `options.sep` for backwards compatibility with versions <4.0.

**Example**

```js
split('a.b,c', {separator: ','});
//=> ['a.b', 'c']

// you can also pass the separator as a string as the last argument
split('a.b,c', ',');
//=> ['a.b', 'c']
```

### options.split

**Type**: `function`

**Default**: the default function returns `true`

Pass a custom function to be called each time a separator is encountered. If the function returns `false` the string will not be split on that separator.

**Example**

```js
const arr = split('a.b.c', {
  split: function() {
    const prev = this.prev();
    if (prev && prev.value === 'a') {
      return false;
    }
    return true;
  }
});
console.log(arr);
//=> ['a.b', 'c']
```

Note that the [snapdragon-lexer](https://github.com/here-be-snapdragons/snapdragon-lexer) instance is exposed as `this` inside the function. See `snapdragon-lexer` for more information and complete API documentation.

## Customizer

**Type**: `function`

**Default**: `undefined`

Pass a function as the last argument to customize how tokens are added to the array.

**Example**

```js
var res = split('a.b', function(token) {
  if (token.tokens[0] === 'a') {
    token.split = false;
  }
});
console.log(res);
//=> ['a.b']
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>
<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [deromanize](https://www.npmjs.com/package/deromanize): Convert roman numerals to arabic numbers (useful for books, outlines, documentation, slide decks, etc) | [homepage](https://github.com/jonschlinkert/deromanize "Convert roman numerals to arabic numbers (useful for books, outlines, documentation, slide decks, etc)")
* [randomatic](https://www.npmjs.com/package/randomatic): Generate randomized strings of a specified length using simple character sequences. The original generate-password. | [homepage](https://github.com/jonschlinkert/randomatic "Generate randomized strings of a specified length using simple character sequences. The original generate-password.")
* [repeat-string](https://www.npmjs.com/package/repeat-string): Repeat the given string n times. Fastest implementation for repeating a string. | [homepage](https://github.com/jonschlinkert/repeat-string "Repeat the given string n times. Fastest implementation for repeating a string.")
* [romanize](https://www.npmjs.com/package/romanize): Convert numbers to roman numerals (useful for books, outlines, documentation, slide decks, etc) | [homepage](https://github.com/jonschlinkert/romanize "Convert numbers to roman numerals (useful for books, outlines, documentation, slide decks, etc)")

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 36 | [jonschlinkert](https://github.com/jonschlinkert) |
| 10 | [doowb](https://github.com/doowb) |

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on January 08, 2018._