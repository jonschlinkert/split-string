var split = require('./');
// var arr = split('a.b', function(tok) {
//   if (tok.arr[tok.arr.length - 1] === 'a') {
//     tok.split = false;
//   }
// });
// console.log(arr);
//=> ['a.b']

var brackets = split('a.{a.{b.c}.}.c', {brackets: true});
var brackets = split('a.{a.{b.c.}.c', {brackets: true});
console.log(brackets);
//=> ['a.b']
