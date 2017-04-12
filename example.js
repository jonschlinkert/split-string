var split = require('./');
var arr = split('a.b', function(tok) {
  if (tok.arr[tok.arr.length - 1] === 'a') {
    tok.split = false;
  }
});
console.log(arr);
//=> ['a.b']
