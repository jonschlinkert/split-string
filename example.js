const split = require('./');

console.log(split('a.{a.[{b.c}].d}.e', {brackets: {'[': ']'}}));
//=> [ 'a', '{a', '[{b.c}]', 'd}', 'e' ]

console.log(split('a.{a.{b.c.d}.c}', {brackets: true}));
//=> [ 'a', '{a.{b.c.d}.c}' ]

const stash1 = split('a.b.c', function(token) {
  const prev = this.prev();
  if (prev && prev.value === 'a') {
    token.split = () => false;
  }
});
console.log(stash1);
//=> ['a.b', 'c']

const stash2 = split('a.b.c', {
  split: function(token) {
    const prev = this.prev();
    if (prev && prev.value === 'a') {
      return false;
    }
    return true;
  }
});
console.log(stash2);
//=> ['a.b', 'c']

