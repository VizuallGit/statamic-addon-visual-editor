import test from 'node:test';
import assert from 'node:assert/strict';
import { rootSelector, staticClasses } from '../../resources/js/component-signature.js';

test('static classes: Antlers is dropped whole, the [ ] marks are dropped, the rest stays', () => {
  assert.deepEqual(staticClasses('<div class="[ {{ _class }} ] card bg-{{ color }} p-400">'), ['card', 'p-400']);
});

test('an arbitrary value keeps its brackets instead of leaving a fragment behind', () => {
  assert.deepEqual(
    staticClasses('<div class="flow-y prose-headings:max-w-[30ch] prose-p:opacity-75 {{ class }}">'),
    ['flow-y', 'prose-headings:max-w-[30ch]', 'prose-p:opacity-75']
  );
});

test('the root selector escapes what CSS needs escaped', () => {
  assert.equal(
    rootSelector('<div class="flex prose-headings:max-w-[30ch] {{ class }}">\n  {{ slot }}\n</div>'),
    'div.flex.prose-headings\\:max-w-\\[30ch\\]'
  );
});

test('Antlers that writes no markup before the first tag is not the root', () => {
  const html =
    '{{ _w = props_width }}\n{{ if _aspect }}\n  {{ _h = _w }}\n{{ /if }}\n<img class="max-w-full {{ class }}" src="{{ src }}">';

  assert.equal(rootSelector(html), 'img.max-w-full');
});

test('a bare div points at nothing; a bare header points at the header', () => {
  assert.equal(rootSelector('<div>{{ slot }}</div>'), null);
  assert.equal(rootSelector('<header>{{ slot }}</header>'), 'header');
});
