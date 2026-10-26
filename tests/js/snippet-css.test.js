import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSnippetIntoBody, parseBody, snippetBodyFrom, wrapSnippetBody } from '../../resources/js/snippet-css.js';

const CAROUSEL = [
  '--button-size: var(--size-800);',
  'display: grid;',
  'grid-auto-flow: column;',
  'gap: var(--size-500);',
  'overflow-x: auto;',
  'scroll-snap-type: x mandatory;',
  '',
  '&::-webkit-scrollbar {',
  '  display: none;',
  '}',
  '',
  '&::scroll-marker-group {',
  '  display: flex;',
  '}',
].join('\n');

// ---- snippetBodyFrom: what the pane offers, as a body ----

test('one whole rule gives its inside, dedented, without the selector', () => {
  const pane = `.testimonials-list {\n    ${CAROUSEL.split('\n').join('\n    ').replace(/\n    \n/g, '\n\n')}\n}\n`;

  assert.deepEqual(snippetBodyFrom(pane), { body: CAROUSEL });
});

test('declarations and nested blocks are taken as written', () => {
  assert.deepEqual(snippetBodyFrom(CAROUSEL), { body: CAROUSEL });
  assert.deepEqual(snippetBodyFrom('  gap: 1rem;\n  color: red'), { body: 'gap: 1rem;\ncolor: red' });
  assert.deepEqual(snippetBodyFrom('@media (width < 64em) {\n  gap: 0;\n}'), { body: '@media (width < 64em) {\n  gap: 0;\n}' });
});

test('a rule beside anything else is refused, and so is text that does not close', () => {
  assert.deepEqual(snippetBodyFrom('.a {\n  color: red;\n}\n.b {\n  color: blue;\n}'), { problem: 'rules' });
  assert.deepEqual(snippetBodyFrom('gap: 1rem;\n.a {\n  color: red;\n}'), { problem: 'rules' });
  assert.deepEqual(snippetBodyFrom('.a {\n  color: red;'), { problem: 'unbalanced' });
  assert.deepEqual(snippetBodyFrom('  \n/* nothing */\n'), { problem: 'empty' });
});

test('a selected rule with a comment above it still counts as one rule', () => {
  assert.deepEqual(snippetBodyFrom('/* the list */\n.list {\n  display: grid;\n}'), { body: 'display: grid;' });
});

// ---- parseBody ----

test('parseBody reads declarations, nested blocks and the last line without its semicolon', () => {
  const items = parseBody('\n    --x: 1;\n    color: red;\n    &:hover {\n        color: blue;\n    }\n    gap: 1rem\n');

  assert.deepEqual(
    items.map((it) => (it.kind === 'decl' ? [it.prop, it.value] : [it.kind, it.prelude])),
    [['--x', '1'], ['color', 'red'], ['block', '&:hover'], ['gap', '1rem']],
  );
});

test('parseBody keeps a semicolon inside a string out of the count', () => {
  const items = parseBody("content: ';';\ncolor: red;");

  assert.deepEqual(items.map((it) => [it.prop, it.value]), [['content', "';'"], ['color', 'red']]);
});

// ---- mergeSnippetIntoBody: the snippet wins ----

test('an empty rule takes the whole body, indented one step in', () => {
  assert.equal(
    mergeSnippetIntoBody('\n', 'display: grid;\ngap: 1rem;\n\n&:hover {\n  color: red;\n}'),
    '\n    display: grid;\n    gap: 1rem;\n\n    &:hover {\n        color: red;\n    }\n',
  );
});

test('a property the rule already has takes the snippet\'s value, in place; new ones follow the last declaration', () => {
  const inner = '\n    display: flex;\n    gap: 2rem;\n    /* keep */\n    color: red;\n';

  assert.equal(
    mergeSnippetIntoBody(inner, 'gap: 1rem;\noverflow-x: auto;'),
    '\n    display: flex;\n    gap: 1rem;\n    /* keep */\n    color: red;\n    overflow-x: auto;\n',
  );
});

test('custom properties count as properties and are matched exactly', () => {
  const inner = '\n    --button-size: var(--size-600);\n    --Button-Size: 1px;\n';

  assert.equal(
    mergeSnippetIntoBody(inner, '--button-size: var(--size-800);'),
    '\n    --button-size: var(--size-800);\n    --Button-Size: 1px;\n',
  );
});

test('a nested block with the same selector is merged inside, property by property; a new one goes at the end', () => {
  const inner = [
    '',
    '    display: grid;',
    '',
    '    &::-webkit-scrollbar {',
    '        width: 0;',
    '        display: block;',
    '    }',
    '',
  ].join('\n');

  assert.equal(
    mergeSnippetIntoBody(inner, CAROUSEL),
    [
      '',
      '    display: grid;',
      '    --button-size: var(--size-800);',
      '    grid-auto-flow: column;',
      '    gap: var(--size-500);',
      '    overflow-x: auto;',
      '    scroll-snap-type: x mandatory;',
      '',
      '    &::-webkit-scrollbar {',
      '        width: 0;',
      '        display: none;',
      '    }',
      '',
      '    &::scroll-marker-group {',
      '        display: flex;',
      '    }',
      '',
    ].join('\n'),
  );
});

test('new declarations go in front of the first block when the rule has no declarations', () => {
  const inner = '\n    &:hover {\n        color: blue;\n    }\n';

  assert.equal(
    mergeSnippetIntoBody(inner, 'gap: 1rem;'),
    '\n    gap: 1rem;\n\n    &:hover {\n        color: blue;\n    }\n',
  );
});

test('a @media block is found whatever the spacing of its query, and a nested rule keeps the file\'s indent width', () => {
  const inner = '\n  gap: 2rem;\n  @media (width<64em) {\n    gap: 1rem;\n  }\n';

  assert.equal(
    mergeSnippetIntoBody(inner, wrapSnippetBody('gap: 0;\ncolor: red;', { media: '(width < 64em)' })),
    '\n  gap: 2rem;\n  @media (width<64em) {\n    gap: 0;\n    color: red;\n  }\n',
  );
});

test('the closing brace of a nested rule keeps the indent of its own selector', () => {
  const inner = '\n        display: none;\n    ';

  assert.equal(
    mergeSnippetIntoBody(inner, 'width: 0;', { parentIndent: '    ' }),
    '\n        display: none;\n        width: 0;\n    ',
  );
});

test('nothing to write leaves the text byte for byte', () => {
  assert.equal(mergeSnippetIntoBody('\n    color: red;\n', ''), '\n    color: red;\n');
});

// ---- wrapSnippetBody: size and state tabs ----

test('a state wraps the body in &:state, a size in @media, both nest the state inside the size', () => {
  assert.equal(wrapSnippetBody('color: red;', { state: ':hover' }), '&:hover {\n    color: red;\n}');
  assert.equal(wrapSnippetBody('color: red;', { media: '(width < 64em)' }), '@media (width < 64em) {\n    color: red;\n}');
  assert.equal(
    wrapSnippetBody('color: red;', { state: '::before', media: '(width < 48em)' }),
    '@media (width < 48em) {\n    &::before {\n        color: red;\n    }\n}',
  );
});

test('a snippet wrapped for a size merges into the rule\'s existing block for that size', () => {
  const inner = '\n    gap: 2rem;\n\n    @media (width < 64em) {\n        gap: 1rem;\n    }\n';

  assert.equal(
    mergeSnippetIntoBody(inner, wrapSnippetBody('gap: 0;', { state: ':hover', media: '(width < 64em)' })),
    '\n    gap: 2rem;\n\n    @media (width < 64em) {\n        gap: 1rem;\n\n        &:hover {\n            gap: 0;\n        }\n    }\n',
  );
});
