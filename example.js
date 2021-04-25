const split = require('./');


console.log(split('a.b."c.d.e.f.g".h.i', { quotes: ['"'] }));
//=> [ 'a', 'b', '"c.d.e.f.g"', 'h', 'i' ]

console.log(split('a.b."c.d.e.f.g".h.i'));
//=> [ 'a', 'b', '"c.d.e.f.g"', 'h', 'i' ]

console.log(split('a.b.\\"c.d."e.f.g".h.i', { quotes: ['"']}));
//=> [ 'a', 'b', '"c.d.e.f.g"', 'h', 'i' ]

let keep = (value, state) => {
  return value !== '\\' && (value !== '"' || state.prev() === '\\');
};
console.log(split('a.b.\\"c.d."e.f.g".h.i', { quotes: ['"'], keep }));
//=> [ 'a', 'b', '"c', 'd', 'e.f.g', 'h', 'i' ]

// console.log(split('a.[{a.b}].e', { brackets: { '[': ']' } }));
// console.log(split('a.[a.c.{d.e}].b', { brackets: { '[': ']' } }));
// console.log(split('a\\.[a.c.{d.e}].b', { brackets: { '[': ']' } }));
// console.log(split('...a.[a.c.{d.e}].b.s.s.s.s.s.', { brackets: { '[': ']' } }));
//=> [ 'a', '{a', '[{b.c}]', 'd}', 'e' ]
// console.log(split('a.{b.c}.[d.e].f', { brackets: true }));
// //=> [ 'a', '{b.c}', '[d', 'e]', 'f' ]
// console.log(split('«a.b».⟨c.d⟩.[e.f]', { brackets: { '«': '»', '⟨': '⟩' } }));
// //=> [ '«a.b»', '⟨c.d⟩' ]
// const arr = split('a.b.c.a.d.e', state => {
//   console.log(state)
//   return state.prev() === 'a';
// });
// console.log(arr)
// // => [ 'a', 'b.c.a', 'd.e' ]

// console.log(split('a.{a.{b.c.d}.c}', { brackets: true }));
// //=> [ 'a', '{a.{b.c.d}.c}' ]

// const stash1 = split('a.b.c', state => state.prev() !== 'a');
// console.log(stash1);
// //=> ['a.b', 'c']


// console.log(split('zzz.{a.{b.{c.{d}.e}.f}.g}.xxx'));
// console.log(split('a.{b.c}|{d.e}', { separator: '|' }));
// console.log(split('a.{b.c}|{d.e}', { separator: '||' }));
// console.log(split('a.{b.c}|{d.e}', { separator: ['||', '&&'] }));
// console.log(split('a.{b.c}|{d.e}'));
// console.log(split('a.{b.c}.{d.e}'));
// console.log(split('a.{b.c}.{d.e}', { brackets: false }));
// console.log(split('a.{b.c}\\.{d.e}'));
// console.log(split('a.{b.c.[a-b]}.{d.e}'));
// console.log(split('a."a.b.c"\\.{d.e}', { quotes: ['"'], keep: () => true }));
