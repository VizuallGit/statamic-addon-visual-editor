import test from 'node:test';
import assert from 'node:assert/strict';
import { rootSelector, staticAttributes, staticClasses } from '../../resources/js/component-signature.js';

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

test('a wrapper opened inside a condition is not the root; the first tag that always renders is', () => {
  const html =
    '{{# {{ if quoted }} in a comment opens nothing #}}\n' +
    '{{ _blur = src && ! live_preview }}\n' +
    '{{ if _blur }}<div class="blurred-img" style="background-image: url({{ glide :src="src" }})">{{ /if }}\n' +
    '<img\n    {{ if _id }}\n        id="{{ _id }}"\n    {{ endif }}\n    class="max-w-full {{ class }}"\n    src="{{ src }}"\n>\n' +
    '{{ if _blur }}</div>{{ /if }}';

  assert.equal(rootSelector(html), 'img.max-w-full');
});

test('a component wrapped whole in one condition is that element when it renders', () => {
  assert.equal(
    rootSelector('{{ if links }}\n  <div class="inline-flex gap-100 {{ class }}" {{ visual_edit field="links" }}>\n    {{ links }}<a>{{ /links }}\n  </div>\n{{ endif }}'),
    'div.inline-flex.gap-100'
  );
});

test('a conditional block before the root is not the root', () => {
  assert.equal(
    rootSelector('{{ if (form:errors) }}<p>Fejl</p>{{ /if }}\n<div class="col-span-12">{{ slot }}</div>'),
    'div.col-span-12'
  );
});

test('static attributes name a root that has no classes of its own', () => {
  assert.equal(
    rootSelector('<a class="{{ class }}" href="/" aria-label="Gå til {{ site_name }}">{{ slot }}</a>'),
    'a[href="/"]'
  );
  assert.deepEqual(
    staticAttributes('<ul class="x" style="--n: 1" role="list" id="{{ _id }}" data-x="a" {{ visual_edit field="y" }}>'),
    [['role', 'list'], ['data-x', 'a']]
  );
});

test('an attribute inside a condition, or a parameter of a nested Antlers tag, is not the root\'s', () => {
  const img =
    '<img\n    {{ if priority == \'true\' }}\n        priority="true"\n    {{ /if }}\n' +
    '    class="max-w-full {{ class }}"\n    loading="{{ loading or \'lazy\' }}"\n' +
    '    srcset="{{ glide :src="_src" width="{{ _w }}" fit="crop_focal" }} 1x, {{ glide :src="_src" dpr="2" }} 2x"\n' +
    '    alt="{{ if imagePath }}{{ imagePath:alt }}{{ /if }}"\n>';

  assert.deepEqual(staticAttributes(img), []);
  assert.equal(rootSelector(img), 'img.max-w-full');
});

test('a bare div points at nothing; a bare header points at the header', () => {
  assert.equal(rootSelector('<div>{{ slot }}</div>'), null);
  assert.equal(rootSelector('<header>{{ slot }}</header>'), 'header');
});
