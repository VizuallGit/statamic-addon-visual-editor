import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elementInsertPoint } from '../../resources/js/dock/insert-point.js';

/** The position of `|` in a snippet, and the snippet without it. */
const at = (src) => {
  const pos = src.indexOf('|');

  return [src.slice(0, pos) + src.slice(pos + 1), pos];
};

const moved = (src) => {
  const [text, pos] = at(src);
  const to = elementInsertPoint(text, pos);

  return text.slice(0, to) + '|' + text.slice(to);
};

test('between tags the caret stays where it is', () => {
  assert.equal(moved('<div>|</div>'), '<div>|</div>');
  assert.equal(moved('<p>hel|lo</p>'), '<p>hel|lo</p>');
  assert.equal(moved('<img src="">|'), '<img src="">|');
  assert.equal(moved('|<div></div>'), '|<div></div>');
});

test('inside an opening tag the caret moves past its >', () => {
  assert.equal(
    moved('<video class="mt-700" autoplay="false" muted="true" |src="{{ media }}"></video>'),
    '<video class="mt-700" autoplay="false" muted="true" src="{{ media }}">|</video>'
  );
  assert.equal(moved('<h|2>x</h2>'), '<h2>|x</h2>');
  assert.equal(moved('<|div>'), '<div>|');
});

test('inside a closing tag the caret moves past it', () => {
  assert.equal(moved('<video></vid|eo>'), '<video></video>|');
});

test('a > inside a quoted attribute does not end the tag', () => {
  assert.equal(moved('<a title="a > b" hr|ef="">x</a>'), '<a title="a > b" href="">|x</a>');
  assert.equal(moved(`<a title='don"t' hr|ef="">x</a>`), `<a title='don"t' href="">|x</a>`);
});

test('antlers inside the tag is part of the tag', () => {
  assert.equal(
    moved('<h1 {{ visual_edit field="headline" }} cl|ass="">x</h1>'),
    '<h1 {{ visual_edit field="headline" }} class="">|x</h1>'
  );
  assert.equal(moved('<div class="{{ if a > b }}x{{ /if }}" i|d="">'), '<div class="{{ if a > b }}x{{ /if }}" id="">|');
});

test('inside an antlers expression the caret moves past its }}', () => {
  assert.equal(moved('<p>{{ head|line }}</p>'), '<p>{{ headline }}|</p>');
  assert.equal(moved('{{ if x }}|{{ /if }}'), '{{ if x }}|{{ /if }}');
});

test('inside a comment the caret moves past it', () => {
  assert.equal(moved('<!-- no|te --><p></p>'), '<!-- note -->|<p></p>');
});

test('an unfinished tag or expression leaves the caret alone', () => {
  assert.equal(moved('<div cl|'), '<div cl|');
  assert.equal(moved('<div class="x"\n<a></a> i|d=""></div>'), '<div class="x"\n<a></a> i|d=""></div>');
  assert.equal(moved('{{ head|line'), '{{ head|line');
});

test('text with a lone < is not a tag', () => {
  assert.equal(moved('<p>a < b|</p>'), '<p>a < b|</p>');
});
