/**
 * Testing the TypeScript definitions for split-string.
 */
import split from '../';

function keep(value, state) {
  return value !== '\\' && (value !== '"' || state.prev() === '\\');
};

function splitFunc(state) {
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

// should error
split();
split(splitFunc);
split({ quotes: ['"'] });
