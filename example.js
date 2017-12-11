var split = require('./');
// var arr = split('a.b', function(token) {
//   if (token.arr[token.arr.length - 1] === 'a') {
//     token.split = false;
//   }
// });
// console.log(arr);
//=> ['a.b']

var brackets = split('a.{a.{b.c}.}.c', {brackets: true});
var brackets = split('a.{a.{b.c.}.c', {brackets: true});
console.log(brackets);
//=> ['a.b']

var res = split('a.b', function(token) {
  if (token.tokens[0] === 'a') {
    token.split = false;
  }
});
console.log(res);
//=> ['a.b']
