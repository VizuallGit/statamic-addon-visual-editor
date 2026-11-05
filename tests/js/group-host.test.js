/**
 * lib/group-host.js — where a group-hover / group-focus class finds its `group`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupHost } from '../../resources/js/lib/group-host.js';

const at = (html, needle) => html.indexOf(needle);

const LIST = `<section class="py-8">
  <div class="wrapper">
    <ul>
      <li class="card"><div class="body"><h3 id="h">A</h3></div><img id="img" src=""></li>
      <li class="card"><div class="body"><h3>B</h3></div><img src=""></li>
      <li class="card"><div class="body"><h3>C</h3></div><img src=""></li>
    </ul>
  </div>
</section>`;

test('the owner\'s example: a heading or an image in a list item — the <li>, not the section', () => {
  const li = at(LIST, '<li class="card">');

  assert.equal(groupHost(LIST, at(LIST, '<h3 id="h"')), li);
  assert.equal(groupHost(LIST, at(LIST, '<img id="img"')), li);
});

test('the pick\'s own siblings do not count: a text div beside an image in a card is not the repeat', () => {
  const html = '<div class="grid"><div class="card"><div class="media"><img></div><div class="text"><h3 id="h">A</h3></div></div><div class="card"><div class="media"></div><div class="text"></div></div></div>';

  assert.equal(groupHost(html, at(html, '<h3 id="h"')), at(html, '<div class="card">'));
});

test('a loop repeats what stands straight in it, one in the file or not', () => {
  const html = '<section><div class="grid">{{ collection:cases }}<article class="case"><h3 id="h">{{ title }}</h3></article>{{ /collection:cases }}</div></section>';

  assert.equal(groupHost(html, at(html, '<h3 id="h"')), at(html, '<article'));
});

test('a condition is see-through: an item inside {{ if }} still sees its siblings', () => {
  const html = '<ul><li class="i"><a id="a">x</a></li>{{ if more }}<li class="i"><a>y</a></li>{{ /if }}</ul>';

  assert.equal(groupHost(html, at(html, '<a id="a"')), at(html, '<li class="i">'));
});

test('two bare columns repeat', () => {
  const html = '<section><div class="grid grid-cols-2"><div><p id="p">a</p></div><div><p>b</p></div></div></section>';

  assert.equal(groupHost(html, at(html, '<p id="p"')), at(html, '<div><p id="p"'));
});

test('nothing repeats: the pick\'s own parent', () => {
  const html = '<section class="hero"><div class="wrapper"><div class="text"><h1 id="h">Hi</h1></div></div></section>';

  assert.equal(groupHost(html, at(html, '<h1 id="h"')), at(html, '<div class="text"'));
});

test('straight inside the section: the section is the parent, and it is the one', () => {
  const html = '<section class="hero"><h1 id="h">Hi</h1></section>';

  assert.equal(groupHost(html, at(html, '<h1 id="h"')), 0);
});

test('an element that already wears group, nearer than the repeat, is the one', () => {
  const html = '<ul><li class="i"><div class="group x"><span id="s">a</span></div></li><li class="i"></li></ul>';

  assert.equal(groupHost(html, at(html, '<span id="s"')), at(html, '<div class="group x"'));
});

test('a section\'s own group (a Data state\'s) is not taken: the walk stops there', () => {
  const html = '<section class="group" data-position="left"><div class="wrapper"><div class="text"><h2 id="h">x</h2></div></div></section>';

  assert.equal(groupHost(html, at(html, '<h2 id="h"')), at(html, '<div class="text"'));
});

test('sections side by side on a layout are not a repeat', () => {
  const html = '<main><section class="s"><div class="wrapper"><p id="p">a</p></div></section><section class="s"></section></main>';

  assert.equal(groupHost(html, at(html, '<p id="p"')), at(html, '<div class="wrapper"'));
});

test('a tag with nothing around it, or no tag there: null', () => {
  const html = '<div><p>x</p></div>';

  assert.equal(groupHost(html, 0), null);
  assert.equal(groupHost(html, 2), null);
});
