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

test('an animation on the switch follows it too, as the Animation tab binds it', () => {
  const html = '<section x-data="{ open: false }"><button @click="open = !open">Go</button><div x-show="open" :data-anim-active="open" data-anim="self" data-anim-on="switch">Hi</div></section>';

  assert.deepEqual(followsOn(attrsAt(html, '0:section/1:div'), ['open']), [
    { attr: 'x-show', name: 'open', then: 'show' },
    { attr: ':data-anim-active', name: 'open', then: 'animate' },
  ]);
  assert.deepEqual(followsOn([{ name: 'x-bind:data-anim-active', value: 'menu' }], ['menu']), [{ attr: 'x-bind:data-anim-active', name: 'menu', then: 'animate' }]);
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

test('tabs: each button shows its panel, the first shown, roles for a screen reader', () => {
  const html = '<section><nav><button>A</button><button @click="track()">B</button></nav><div><p>One</p><p>Two</p></div></section>';
  const { html: next, name } = withPattern(html, PATTERNS.find((p) => p.key === 'tabs'), '0:section/0:nav', '0:section/1:div');

  assert.equal(name, 'tab');
  assert.equal(
    next,
    '<section x-data="{ tab: 1 }"><nav role="tablist"><button :aria-selected="tab === 1" role="tab" @click="tab = 1">A</button><button :aria-selected="tab === 2" role="tab" @click="track(); tab = 2">B</button></nav><div><p x-show="tab === 1" role="tabpanel">One</p><p x-cloak x-show="tab === 2" role="tabpanel">Two</p></div></section>'
  );
});

test('a carousel: first button back, last on, round the ends, dots between', () => {
  const html = '<section x-data="{ open: false }"><div><i>a</i><i>b</i><i>c</i></div><nav><button>‹</button><button>1</button><button>2</button><button>3</button><button>›</button></nav></section>';
  const { html: next, name } = withPattern(html, PATTERNS.find((p) => p.key === 'carousel'), '0:section/1:nav', '0:section/0:div');

  assert.equal(name, 'slide');
  assert.match(next, /x-data="\{ open: false, slide: 0 \}"/);
  assert.match(next, /<button @click="slide = \(slide \+ 2\) % 3">‹<\/button>/);
  assert.match(next, /<button :aria-current="slide === 1" @click="slide = 1">2<\/button>/);
  assert.match(next, /<button @click="slide = \(slide \+ 1\) % 3">›<\/button>/);
  assert.match(next, /<i x-show="slide === 0">a<\/i><i x-cloak x-show="slide === 1">b<\/i><i x-cloak x-show="slide === 2">c<\/i>/);
});

test('a second set of tabs gets a value of its own, and no holder means no tabs', () => {
  const html = '<section x-data="{ tab: 1 }"><nav><b>A</b></nav><div><p>One</p></div></section>';

  assert.equal(withPattern(html, PATTERNS.find((p) => p.key === 'tabs'), '0:section/0:nav', '0:section/1:div').name, 'tab2');
  assert.equal(withPattern('<nav><b>A</b></nav><div><p>One</p></div>', PATTERNS.find((p) => p.key === 'tabs'), '0:nav', '1:div'), null);
});

test('every step is a trigger the dock has', () => {
  for (const step of PATTERNS.flatMap((p) => p.steps || [])) {
    assert.ok(TRIGGERS.includes(step.when), step.when);
    assert.ok(!step.then || THENS.some((item) => item.id === step.then), step.then);
  }
});
