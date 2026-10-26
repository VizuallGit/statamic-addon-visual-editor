/**
 * ghost-instant.js: grey text worked out from the section's own fields and
 * the markup around the caret, with no model — the loop in a list, an item's
 * fields, visual_edit, x-data. The cases are content/featured_testimonials'.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caretAt, fieldLines, insideElement, instantSuggestion, listsOf, openLoop } from '../../resources/js/dock/ghost-instant.js';

const ROWS = [
  { var: 'title', type: 'text', label: 'Title' },
  { var: 'entries', type: 'replicator', label: 'Testimonials', loop: true },
  { var: 'text', type: 'textarea', label: 'Text', parent: 'entries' },
  { var: 'name', type: 'text', label: 'Name', parent: 'entries' },
  { var: 'profile_image', type: 'assets', label: 'Profile image', parent: 'entries' },
  { var: 'logo', type: 'toggle', label: 'Logo on', parent: 'entries' },
];

/** The suggestion with the caret at `|`. */
function at(source, rows = ROWS) {
  const pos = source.indexOf('|');

  return instantSuggestion(source.replace('|', ''), pos, rows);
}

test('the caret is read: attribute, Antlers, opening tag, markup', () => {
  assert.deepEqual(caretAt('<section id="id-{{ id }}" x-data="{ '), { kind: 'attribute', tag: 'section', attribute: 'x-data', quote: '"', value: '{ ' });
  assert.equal(caretAt('<h2 {{ visual_').kind, 'antlers');
  assert.equal(caretAt('<ul class="list" ').kind, 'tag');
  assert.deepEqual(caretAt('<section>\n  <ul>\n    '), { kind: 'markup', fresh: true, indent: '    ', inside: 'ul' });
  assert.equal(insideElement('<ul><li>x</li><li><img src="a"><p>'), 'p');
});

test('the section\'s lists and the loop the caret stands in', () => {
  assert.deepEqual([...listsOf(ROWS).keys()], ['entries']);
  assert.equal(openLoop('<ul>\n  {{ entries limit="3" }}\n    ', new Set(['entries'])), 'entries');
  assert.equal(openLoop('{{ entries }}<li></li>{{ /entries }}', new Set(['entries'])), null);
});

test('an empty line in a <ul>: the loop over the list, the item with its fields', () => {
  assert.equal(
    at('<section>\n  <ul class="[ testimonials-list ]">\n    |\n  </ul>\n</section>'),
    [
      '{{ entries }}',
      '      <li {{ visual_edit orderable="true" }}>',
      '        <p {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</p>',
      '        <p {{ visual_edit field="name" inline_edit="true" }}>{{ name }}</p>',
      '        {{ if profile_image }}',
      '          <img src="{{ profile_image:url }}" alt="" {{ visual_edit field="profile_image" }}>',
      '        {{ /if }}',
      '      </li>',
      '    {{ /entries }}',
    ].join('\n'),
  );
});

test('the site\'s image component, when the file uses it', () => {
  const out = at('{{ partial:components/image :imagePath="hero" }}\n<ul>\n  |\n</ul>');

  assert.match(out, /\{\{ partial:components\/image :imagePath="profile_image" \}\}/);
});

test('inside the loop: the item; inside the item: its next field', () => {
  assert.match(at('<ul>\n  {{ entries }}\n    |\n  {{ /entries }}\n</ul>'), /^<li \{\{ visual_edit orderable="true" \}\}>\n {6}<p \{\{ visual_edit field="text"/);
  assert.equal(
    at('<ul>\n  {{ entries }}\n    <li>\n      <p>{{ text }}</p>\n      |\n    </li>\n  {{ /entries }}\n</ul>'),
    '<p {{ visual_edit field="name" inline_edit="true" }}>{{ name }}</p>',
  );
});

test('a list the file already loops over gets no second loop', () => {
  assert.equal(at('<ul>\n  {{ entries }}<li></li>{{ /entries }}\n</ul>\n<ul>\n  |\n</ul>'), '');
});

test('an empty line elsewhere: the next field the file does not show, a title as a heading', () => {
  assert.equal(at('<section>\n  |\n</section>'), '<h2 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h2>');
  assert.equal(at('<section>\n  <h2>{{ title }}</h2>\n  |\n</section>'), '');
});

test('{{ visual_ and {{ visual_edit : the field the element is for', () => {
  assert.equal(at('<h2 class="x" {{ visual_|>{{ title }}</h2>'), 'edit field="title" inline_edit="true" }}');
  assert.equal(at('<h2 {{ visual_edit | }}>'), 'field="title" inline_edit="true"');
  assert.equal(at('<ul>{{ entries }}<li><p {{ visual_|>'), 'edit field="text" inline_edit="true" }}');
});

test('x-data: a state to start from', () => {
  assert.equal(at('<section x-data="|">'), '{ open: false }');
  assert.equal(at('<section x-data="{ |">'), 'open: false }');
  assert.equal(at('<section x-data="{|}">'), ' open: false');
  assert.equal(at('<section x-data="{ open: true, |">'), '');
});

test('where these rules have nothing, the AI is left to answer', () => {
  assert.equal(at('<p class="text-|">'), '');
  assert.equal(at('<div>\n  <p|\n</div>'), '');
  assert.equal(at('<section>\n  |\n</section>', []), '');
});

test('fields that are settings, not content, are not written', () => {
  assert.equal(fieldLines({ var: 'logo', type: 'toggle' }), null);
  assert.deepEqual(fieldLines({ var: 'body', type: 'bard' }), ['<div {{ visual_edit field="body" inline_edit="true" }}>{{ body }}</div>']);
});
