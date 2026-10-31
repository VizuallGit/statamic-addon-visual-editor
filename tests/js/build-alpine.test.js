import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALPINE_BEHAVIOURS } from '../../resources/js/alpine-behaviours.js';
import { alpineAttrs, freeName, statesInScope, withAction, withAlpineAttr, withStateFor, withoutAlpineAttr } from '../../resources/js/build-mode/alpine.js';
import { parseTemplateTree } from '../../resources/js/html-tree-parse.js';
import { findByPath } from '../../resources/js/build-mode/place.js';

const SHOW = ALPINE_BEHAVIOURS.find((item) => item.id === 'show');
const SMOOTH = ALPINE_BEHAVIOURS.find((item) => item.id === 'show_smooth');
const CLASS_WHEN = ALPINE_BEHAVIOURS.find((item) => item.id === 'class_when');
const paths = (html) => {
  const out = [];
  const walk = (nodes) => nodes.forEach((node) => {
    out.push([node.tag, node.path]);
    walk(node.children);
  });

  walk(parseTemplateTree(html));

  return Object.fromEntries(out);
};
const FILE = '<section class="a" {{ visual_edit outline="true" :x="y" }}><button>Go</button><div class="b"><p>Hi</p></div></section>';

test('an attribute goes right after the tag name, and bare without a value', () => {
  const { button } = paths(FILE);

  assert.match(withAlpineAttr(FILE, button, '@click', 'open = true'), /<button @click="open = true">/);
  assert.match(withAlpineAttr(FILE, button, 'x-cloak', ''), /<button x-cloak>/);
});

test('an attribute is replaced where it stands and taken off with its space', () => {
  const one = withAlpineAttr(FILE, paths(FILE).button, '@click', 'a = 1');
  const two = withAlpineAttr(one, paths(one).button, '@click', 'b = 2');

  assert.match(two, /<button @click="b = 2">/);
  assert.match(withoutAlpineAttr(two, paths(two).button, '@click'), /<button>/);
});

test('what stands inside {{ }} in a tag is not Alpine', () => {
  const node = findByPath(parseTemplateTree(FILE), paths(FILE).section);

  assert.deepEqual(alpineAttrs(FILE, node), []);
});

test('an action writes the switch on the nearest tag holding both, the trigger and what follows', () => {
  const { button, div } = paths(FILE);
  const out = withAction(FILE, { trigger: button, target: div, when: '@click', does: 'toggle', name: 'open', then: SHOW });

  assert.match(out, /<section x-data="\{ open: false \}" class="a"/);
  assert.match(out, /<button @click="open = !open">/);
  assert.match(out, /<div x-cloak x-show="open" class="b">/);
});

test('a switch in reach is used; a new name joins the x-data standing above', () => {
  const file = '<section x-data="{ open: false }"><button>Go</button><div></div></section>';
  const { button, div } = paths(file);

  assert.equal(withStateFor(file, button, div, 'open'), file);
  assert.match(withStateFor(file, button, div, 'menu'), /x-data="\{ open: false, menu: false \}"/);
  assert.equal(freeName(file, [button, div]), 'open2');
});

test('x-data with a function cannot take a name; nothing to hold two roots is said too', () => {
  const file = '<section x-data="dropdown()"><button>Go</button><div></div></section>';
  const { button, div } = paths(file);

  assert.equal(withStateFor(file, button, div, 'open'), null);

  const roots = '<button>Go</button><div></div>';
  const at = paths(roots);

  assert.equal(withStateFor(roots, at.button, at.div, 'open'), null);
});

test('a button that already does something does both', () => {
  const file = '<section x-data="{ a: false }"><button @click="a = true">Go</button><div></div></section>';
  const { button, div } = paths(file);
  const out = withAction(file, { trigger: button, target: div, when: '@click', does: 'toggle', name: 'open', then: SMOOTH });

  assert.match(out, /@click="a = true; open = !open"/);
  assert.match(out, /x-transition/);
});

test('a class while it is on takes the name', () => {
  const file = '<section><button>Go</button><div></div></section>';
  const { button, div } = paths(file);
  const out = withAction(file, { trigger: button, target: div, when: '@click', does: 'on', name: 'open', then: CLASS_WHEN, classes: 'bg-red-500' });

  assert.match(out, /:class="open \? 'bg-red-500' : ''"/);
  assert.doesNotMatch(out, /x-cloak/);
});

test('switches in reach, nearest first', () => {
  const file = '<section x-data="{ a: false }"><div x-data="{ b: true }"><p></p></div></section>';

  assert.deepEqual(statesInScope(file, paths(file).p).map((state) => [state.name, state.tag]), [['b', 'div'], ['a', 'section']]);
});
