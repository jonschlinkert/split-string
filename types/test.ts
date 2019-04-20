/**
 * Testing the TypeScript definitions for split-string.
 */
import split, { State } from '.';

function keep(value: string, state: State) {
  return value !== '\\' && (value !== '"' || state.prev() === '\\');
}

function splitFunc(state: State) {
  console.log(state);
  return state.prev() === 'a';
}

split('a.b."c.d.e.f.g".h.i');
split('a.b."c.d.e.f.g".h.i', { quotes: ['"'] });
split('a.b.\\"c.d.e.f.g".h.i', { quotes: ['"'], keep });
split('a.[{a.b}].e', { brackets: { '[': ']' } });
split('«a.b».⟨c.d⟩.[e.f]', {
  brackets: { '«': '»', '⟨': '⟩'},
  quotes: ['"'],
  separator: '.',
  strict: false,
  keep
});

split('a.b.c.a.d.e', splitFunc);
split('a.b."c.d.e.f.g".h.i', { quotes: ['"'] }, splitFunc);

// Make sure invalid calls fail

split(); // $ExpectError
split(splitFunc); // $ExpectError
split({ quotes: ['"'] }); // $ExpectError
