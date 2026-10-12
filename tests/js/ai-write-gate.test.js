/*
 * The AI chat's write gate: the only way its agent can change a file. Every
 * test runs against a throwaway site in the OS temp folder.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, existsSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createGate, gateTools } from '../../scripts/ai-write-gate.mjs';

const SECTION = 'resources/views/partials/page_sections/hero/style_1.antlers.html';
const FIELDSET = 'resources/fieldsets/hero/style_1.yaml';
const RULES = 'resources/visual-editor/ai-rules.md';

function site() {
  const root = mkdtempSync(join(tmpdir(), 'sve-gate-'));
  const put = (rel, text) => {
    mkdirSync(join(root, rel, '..'), { recursive: true });
    writeFileSync(join(root, rel), text);
  };

  put(SECTION, '<section>\n  <h1>{{ title }}</h1>\n</section>\n');
  put(FIELDSET, 'title: Hero\nfields: []\n');
  put('resources/css/site.css', 'body { color: black; }\n');
  put('resources/fieldsets/page_sections.yaml', 'title: Page sections\n');
  put('resources/fieldsets/links.yaml', 'title: Links\n');
  put(RULES, '# Rules\n\n1. One.\n2. Two.\n');

  return { root, read: (rel) => readFileSync(join(root, rel), 'utf8'), exists: (rel) => existsSync(join(root, rel)) };
}

const scope = { files: [SECTION, FIELDSET], create: ['resources/fieldsets/', 'resources/views/partials/page_sections/'], rules: RULES };
const refused = (result) => typeof result === 'object' && result.isError === true;
const text = (result) => (typeof result === 'string' ? result : result.content[0].text);

test('an open file is edited and reported', () => {
  const s = site();
  const gate = createGate(s.root, scope);

  assert.equal(gate.editFile({ path: SECTION, old_string: '</h1>', new_string: '</h1>\n  <h2>{{ subtitle }}</h2>' }), `Edited ${SECTION}.`);
  assert.match(s.read(SECTION), /<h2>\{\{ subtitle \}\}<\/h2>/);
  assert.deepEqual(gate.written, [SECTION]);
});

test("the site's CSS, shared fieldsets and page_sections.yaml are refused and left as they were", () => {
  const s = site();
  const gate = createGate(s.root, scope);

  for (const path of ['resources/css/site.css', 'resources/fieldsets/links.yaml', 'resources/fieldsets/page_sections.yaml']) {
    const before = s.read(path);

    assert.ok(refused(gate.writeFile({ path, content: 'gone' })), path);
    assert.ok(refused(gate.editFile({ path, old_string: before.slice(0, 5), new_string: 'x' })), path);
    assert.match(text(gate.writeFile({ path, content: 'gone' })), /^LOCKED: /);
    assert.equal(s.read(path), before);
  }

  assert.deepEqual(gate.written, []);
});

test('a path that leaves the site is refused — .., absolute, or through a symlink', () => {
  const s = site();
  const outside = mkdtempSync(join(tmpdir(), 'sve-outside-'));
  const gate = createGate(s.root, scope);

  symlinkSync(outside, join(s.root, 'resources/fieldsets/escape'));

  assert.ok(refused(gate.writeFile({ path: 'resources/fieldsets/../../.env', content: 'x' })));
  assert.ok(refused(gate.writeFile({ path: join(outside, 'a.yaml'), content: 'x' })));
  assert.ok(refused(gate.writeFile({ path: 'resources/fieldsets/escape/new.yaml', content: 'x' })));
  assert.equal(existsSync(join(outside, 'new.yaml')), false);
  assert.equal(s.exists('.env'), false);
});

test('a new section file can be made, once, and then edited — never an existing file by the same door', () => {
  const s = site();
  const gate = createGate(s.root, scope);
  const view = 'resources/views/partials/page_sections/faq/style_1.antlers.html';

  assert.equal(gate.writeFile({ path: view, content: '<section>faq</section>\n' }), `Wrote ${view}.`);
  assert.equal(gate.editFile({ path: view, old_string: 'faq</', new_string: 'FAQ</' }), `Edited ${view}.`);
  assert.equal(s.read(view), '<section>FAQ</section>\n');

  // Only section files, and only where sections live.
  assert.ok(refused(gate.writeFile({ path: 'resources/fieldsets/hack.php', content: '<?php' })));
  assert.ok(refused(gate.writeFile({ path: 'resources/css/new.css', content: 'x' })));
  // The create door does not open an existing file.
  assert.ok(refused(gate.writeFile({ path: 'resources/fieldsets/links.yaml', content: 'gone' })));
});

test('an absolute path inside the site counts as its relative one', () => {
  const s = site();
  const gate = createGate(s.root, scope);

  assert.equal(gate.writeFile({ path: join(s.root, FIELDSET), content: 'title: Hero 2\n' }), `Wrote ${FIELDSET}.`);
  assert.equal(s.read(FIELDSET), 'title: Hero 2\n');
  // The same site by its real path (the OS temp folder is a symlink on macOS).
  assert.equal(gate.writeFile({ path: join(realpathSync(s.root), FIELDSET), content: 'title: Hero 3\n' }), `Wrote ${FIELDSET}.`);
});

test('an edit must match exactly once, or say replace_all', () => {
  const s = site();
  const gate = createGate(s.root, scope);

  assert.match(text(gate.editFile({ path: SECTION, old_string: 'nope', new_string: 'x' })), /not in/);
  assert.match(text(gate.editFile({ path: SECTION, old_string: 'section>', new_string: 'div>' })), /2 times/);
  assert.equal(gate.editFile({ path: SECTION, old_string: 'section>', new_string: 'div>', replace_all: true }), `Edited ${SECTION}.`);
  assert.equal(s.read(SECTION), '<div>\n  <h1>{{ title }}</h1>\n</div>\n');
});

test('a rule is appended with the next number; nothing above it changes', () => {
  const s = site();
  const gate = createGate(s.root, scope);

  assert.equal(gate.addRule({ text: 'Always wrap in .wrapper.\nNo exceptions.' }), `Added rule 3 to ${RULES}.`);
  assert.equal(s.read(RULES), '# Rules\n\n1. One.\n2. Two.\n3. Always wrap in .wrapper. No exceptions.\n');
  assert.ok(refused(gate.writeFile({ path: RULES, content: 'gone' })));
});

test('register_section only records a well-formed request, once', () => {
  const s = site();
  const gate = createGate(s.root, scope);

  assert.match(text(gate.registerSection({ group: 'hero', handle: 'faq/style_1', display: 'FAQ', fieldset: 'faq.style_1' })), /will be added/);
  gate.registerSection({ group: 'hero', handle: 'faq/style_1', display: 'FAQ', fieldset: 'faq.style_1' });
  assert.ok(refused(gate.registerSection({ group: 'hero', handle: '../x', display: 'X', fieldset: 'x.y' })));
  assert.ok(refused(gate.registerSection({ group: 'hero', handle: 'faq/style_2', display: 'FAQ 2' })));
  assert.deepEqual(gate.register, [{ group: 'hero', handle: 'faq/style_1', display: 'FAQ', fieldset: 'faq.style_1' }]);
  assert.equal(s.read('resources/fieldsets/page_sections.yaml'), 'title: Page sections\n');
});

test('the tools offered: add_rule only when the rules file is open', () => {
  const s = site();

  assert.deepEqual(Object.keys(gateTools(createGate(s.root, scope), { rules: true })).sort(), ['add_rule', 'edit_file', 'register_section', 'write_file']);
  assert.deepEqual(Object.keys(gateTools(createGate(s.root, { ...scope, rules: null }))).sort(), ['edit_file', 'register_section', 'write_file']);
});
