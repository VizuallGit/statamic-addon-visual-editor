/**
 * build-mode/action-flow.js — an element's actions as Build's Action tab
 * draws them, and the library's patterns, written with withAction.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  actionsOn,
  followersOf,
  followsOn,
  PATTERNS,
  statement,
  statementOf,
  THENS,
  TRIGGERS,
  TRIGGER_WORDS,
  withPattern,
  withStatement,
} from '../../../resources/js/build-mode/action-flow.js';
import { alpineAttrs, withAction } from '../../../resources/js/build-mode/alpine.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const PAGE = `<section x-data="{ open: false }"><button @click="open = !open; $dispatch('booked')" @keydown.escape.window="open = false">Book</button><dialog class="booking" x-show="open" x-transition x-cloak>Hi</dialog><p :class="open ? 'is-on' : ''">x</p></section>`;
const BUTTON = '0:section/0:button';
const DIALOG = '0:section/1:dialog';
const attrsAt = (html, path) => alpineAttrs(html, findByPath(parseTemplateTree(html), path));

test('every trigger the dock has has a word and an icon here', () => {
  for (const when of TRIGGERS) {
    assert.ok(TRIGGER_WORDS[when], when);
  }
});

test('a trigger\'s statements read as chips, one Action does not write as written', () => {
  assert.deepEqual(actionsOn(attrsAt(PAGE, BUTTON)), [
    { attr: '@click', part: 'open = !open', name: 'open', does: 'toggle' },
    { attr: '@click', part: "$dispatch('booked')", name: null, does: null },
    { attr: '@keydown.escape.window', part: 'open = false', name: 'open', does: 'off' },
  ]);
  assert.deepEqual(statementOf('menu = true'), { name: 'menu', does: 'on' });
  assert.equal(statementOf('open = !menu'), null);
});

test('who follows a switch, and how', () => {
  assert.deepEqual(followsOn(attrsAt(PAGE, DIALOG), ['open']), [{ attr: 'x-show', name: 'open', then: 'show_smooth' }]);
  assert.deepEqual(followsOn(attrsAt(PAGE, DIALOG), ['menu']), []);
  assert.deepEqual(followersOf(PAGE, '0:section', 'open').map((f) => [f.path, f.then]), [
    [DIALOG, 'show_smooth'],
    ['0:section/2:p', 'class_when'],
  ]);
});

test('a statement changes in its place, moves to another trigger, or goes with its attribute', () => {
  const from = { attr: '@click', part: 'open = !open' };

  assert.match(withStatement(PAGE, BUTTON, from, { attr: '@click', part: statement('on', 'open') }), /@click="open = true; \$dispatch\('booked'\)"/);

  const moved = withStatement(PAGE, BUTTON, from, { attr: '@mouseenter', part: statement('on', 'open') });

  assert.match(moved, /@click="\$dispatch\('booked'\)"/);
  assert.match(moved, /@mouseenter="open = true"/);

  const gone = withStatement(PAGE, BUTTON, { attr: '@keydown.escape.window', part: 'open = false' }, null);

  assert.doesNotMatch(gone, /@keydown/);
  assert.match(withStatement(PAGE, BUTTON, { attr: '@keydown.escape.window', part: 'open = false' }, { attr: '@click', part: 'open = !open' }), /@click="open = !open; \$dispatch\('booked'\)"/);
});

test('a popup is withAction three times on one switch of its own', () => {
  const html = '<section><button>Book</button><div class="panel">Hi</div></section>';
  const popup = PATTERNS.find((p) => p.key === 'popup');
  const { html: next, name } = withPattern(html, popup, '0:section/0:button', '0:section/1:div');
  const show = THENS.find((item) => item.id === 'show_smooth');
  const none = { id: 'nothing', attrs: [] };
  let byHand = withAction(html, { trigger: '0:section/0:button', target: '0:section/1:div', when: '@click', does: 'toggle', name: 'open', then: show });

  byHand = withAction(byHand, { trigger: '0:section/1:div', target: '0:section/1:div', when: '@click.outside', does: 'off', name: 'open', then: none });
  byHand = withAction(byHand, { trigger: '0:section/1:div', target: '0:section/1:div', when: '@keydown.escape.window', does: 'off', name: 'open', then: none });

  assert.equal(name, 'open');
  assert.equal(next, byHand);
  assert.equal(
    next,
    '<section x-data="{ open: false }"><button @click="open = !open">Book</button><div @keydown.escape.window="open = false" @click.outside="open = false" x-cloak x-transition x-show="open" class="panel">Hi</div></section>'
  );
});

test('a second pattern beside the first gets a switch of its own', () => {
  const html = '<section x-data="{ open: false }"><button @click="open = !open">A</button><div x-show="open">A</div><button>B</button><div>B</div></section>';
  const { html: next, name } = withPattern(html, PATTERNS.find((p) => p.key === 'accordion'), '0:section/2:button', '0:section/3:div');

  assert.equal(name, 'open2');
  assert.match(next, /x-data="\{ open: false, open2: false \}"/);
});

test('the patterns that wait say so, and every step is a trigger the dock has', () => {
  assert.deepEqual(PATTERNS.filter((p) => p.later).map((p) => p.key), ['tabs', 'carousel']);

  for (const step of PATTERNS.flatMap((p) => p.steps || [])) {
    assert.ok(TRIGGERS.includes(step.when), step.when);
    assert.ok(!step.then || THENS.some((item) => item.id === step.then), step.then);
  }
});
