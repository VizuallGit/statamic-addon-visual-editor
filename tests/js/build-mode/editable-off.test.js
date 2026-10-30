/**
 * "Editable in Edit Content", off again: what the canvas shows is written back
 * as the element's own — only when the canvas shows the element's own content.
 * Right after the field is made, a Bard field or an element inside `{{ if }}`
 * is an island, `<sve-island>` until the real preview has rendered it; an
 * element not on the canvas has nothing. Read back then, the placeholder stood
 * in the file as the rich text, and a missing element emptied the words.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../../resources/js');
const read = (name) => readFileSync(join(JS, name), 'utf8');

test('the canvas answers null for an element it has not got, or one with an island still waiting', () => {
  const canvas = read('build-mode/canvas.js');
  const fn = canvas.slice(canvas.indexOf('shownAt(path, what = \'\') {'), canvas.indexOf('paintInner(path, markup) {'));

  assert.match(fn, /if \(!el \|\| el\.querySelector\(ISLAND_WAIT\)\) \{\n\s+return null;\n\s+\}/);
  assert.ok(!fn.includes("return '';"), 'nothing to show is null, not an empty value');
});

test('the port passes null through, not an empty string', () => {
  const boot = read('build-mode/boot.js');

  assert.ok(boot.includes('shownAt: (path, what) => canvas?.shownAt(path, what) ?? null,'));
});

test('off writes nothing when there is nothing shown: text, address and rich text alike', () => {
  const content = read('cp/surfaces/BuildContent.vue');
  const handler = (name) => content.slice(content.indexOf(`function ${name}() {`), content.indexOf('\n}\n', content.indexOf(`function ${name}() {`)));

  assert.match(handler('textOff'), /const words = port\.shownAt\(path\);\n\n\s+if \(words === null\) \{\n\s+return;\n\s+\}/);
  assert.match(handler('addressOff'), /const url = port\.shownAt\(path, address\.attr\);\n\n\s+if \(url === null\) \{\n\s+return;\n\s+\}/);
  assert.match(handler('richOff'), /const markup = port\.shownAt\(path, 'html'\);\n\n\s+if \(markup === null\) \{\n\s+return;\n\s+\}/);
});
