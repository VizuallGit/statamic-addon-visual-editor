import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addBracketClassToTag, bracketClassTokens, hasTopLevelClassRule } from '../../resources/js/css-scope.js';

function tagAt(html, needle) {
  const from = html.indexOf(needle);

  return [from, html.indexOf('>', from) + 1];
}

test('the name goes into the tag\'s [ ] run, Tailwind after it left as it is', () => {
  const html = '<ul>\n  <li class="[ a ] flex bg-[#343434]">x</li>\n</ul>';
  const [from, to] = tagAt(html, '<li');
  const out = addBracketClassToTag(html, from, to, 'foo');

  assert.equal(out.html, '<ul>\n  <li class="[ a foo ] flex bg-[#343434]">x</li>\n</ul>');
  assert.equal(out.html.slice(from, out.to), '<li class="[ a foo ] flex bg-[#343434]">');
});

test('an empty [ ] left by a removed name takes the name back', () => {
  const html = '<li class="[ ] flex">x</li>';
  const out = addBracketClassToTag(html, 0, html.indexOf('>') + 1, 'yyttrr');

  assert.equal(out.html, '<li class="[ yyttrr ] flex">x</li>');
});

test('a tag without a class attribute gets one; so does a self-closing tag', () => {
  assert.equal(addBracketClassToTag('<li>x</li>', 0, 4, 'foo').html, '<li class="[ foo ]">x</li>');
  assert.equal(addBracketClassToTag('<img src="a.png" />', 0, 19, 'foo').html, '<img src="a.png" class="[ foo ]" />');
});

test('`to` follows the tag, so a second name lands in the same tag', () => {
  const html = '<li class="flex">x</li><li class="[ b ]">y</li>';
  const first = addBracketClassToTag(html, 0, html.indexOf('>') + 1, 'foo');
  const second = addBracketClassToTag(first.html, 0, first.to, 'bar');

  assert.equal(second.html, '<li class="[ foo bar ] flex">x</li><li class="[ b ]">y</li>');
  assert.deepEqual(bracketClassTokens(second.html).map((token) => token.name), ['foo', 'bar', 'b']);
});

test('no change when the tag already has the name, the range is not an opening tag, or the name is not a class', () => {
  const html = '<li class="[  foo ]">x</li>';
  const to = html.indexOf('>') + 1;

  assert.equal(addBracketClassToTag(html, 0, to, 'foo').html, html);
  assert.equal(addBracketClassToTag(html, to, to + 1, 'bar').html, html);
  assert.equal(addBracketClassToTag(html, 0, to, '9').html, html);
  assert.equal(addBracketClassToTag(html, 0, html.length + 1, 'bar').html, html);
});

test('a class attribute with quotes inside it is left alone, not given a second class attribute', () => {
  const html = '<li class="{{ open ? \'is-open\' : \'\' }}">x</li>';
  const out = addBracketClassToTag(html, 0, html.indexOf('">') + 2, 'foo');

  assert.equal(out.html, html);
});

test('top-level rule vs one nested inside another', () => {
  const css = '.card {\n    & .icon {}\n}\n.title {}\n';

  assert.equal(hasTopLevelClassRule(css, 'card'), true);
  assert.equal(hasTopLevelClassRule(css, 'title'), true);
  assert.equal(hasTopLevelClassRule(css, 'icon'), false);
  assert.equal(hasTopLevelClassRule(css, 'missing'), false);
});
